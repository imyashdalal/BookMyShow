import axios from "axios";
import { tokenStorage } from "../utils/secureStorage";

// Get API URL from environment or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  responseType: "json",
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiInstance.interceptors.request.use(
  (reqPayload) => {
    const token = tokenStorage.get();
    if (token) {
      reqPayload.headers.Authorization = `Bearer ${token}`;
    }
    return reqPayload;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error codes
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          console.warn('Unauthorized access - clearing auth data');
          tokenStorage.remove();
          // Optionally redirect to login
          if (window.location.pathname !== '/sign-in') {
            window.location.href = '/sign-in';
          }
          break;
        
        case 403:
          // Forbidden
          console.warn('Access forbidden:', data.error);
          break;
        
        case 429:
          // Too many requests
          console.warn('Rate limit exceeded. Please try again later.');
          break;
        
        case 500:
        case 502:
        case 503:
          // Server errors
          console.error('Server error:', data.error || 'Internal server error');
          break;
        
        default:
          console.error('API error:', data.error || error.message);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error: Unable to reach the server');
    } else {
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiInstance;
