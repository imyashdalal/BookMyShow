import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import {Provider} from 'react-redux';

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import {store} from './store/store.js';
import { SocketProvider } from './contexts/SocketContext.jsx';
import App from "./App.jsx";
import "./index.css";

const queryClient = new QueryClient();

// Force clear old theme and set to luxury
if (localStorage.getItem('theme') !== 'luxury') {
  localStorage.setItem('theme', 'luxury');
  document.documentElement.setAttribute('data-theme', 'luxury');
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    
    <BrowserRouter><Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <App />
          <ReactQueryDevtools />
        </SocketProvider>
      </QueryClientProvider></Provider>
    </BrowserRouter>
    
  </StrictMode>
);
