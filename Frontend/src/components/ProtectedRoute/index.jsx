import { Navigate, useLocation } from 'react-router-dom';
import { useLoggedInUser } from '../hooks/auth.hooks';

/**
 * Protected Route Component
 * Redirects to sign-in if user is not authenticated
 */
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { data: user, isLoading } = useLoggedInUser();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // Not authenticated - redirect to sign-in
  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Check role if specified
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <span>Access Denied: You don't have permission to view this page.</span>
        </div>
      </div>
    );
  }

  return children;
};

/**
 * Public Only Route Component
 * Redirects to dashboard if already authenticated
 * Used for sign-in, sign-up pages
 */
export const PublicOnlyRoute = ({ children }) => {
  const { data: user, isLoading } = useLoggedInUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // Already authenticated - redirect to intended page or dashboard
  if (user) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return children;
};

/**
 * Admin Only Route Component
 * Redirects if user is not admin
 */
export const AdminRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
};

/**
 * User Only Route Component
 * Redirects if user is not a regular user
 */
export const UserRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="user">{children}</ProtectedRoute>;
};

export default ProtectedRoute;
