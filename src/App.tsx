import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import TabsLayout from "./pages/tabs/TabsLayout";
import Homepage from "./pages/tabs/Homepage";
import PatientDiary from "./pages/tabs/PatientDiary";
import Chatbot from "./pages/tabs/Chatbot";
import Profile from "./pages/tabs/Profile";
import NotFound from "./pages/NotFound";

import { PushNotificationSchema, PushNotifications, ActionPerformed, Token } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

import { StatusBar, Style } from '@capacitor/status-bar';
import { useEffect } from 'react';


const queryClient = new QueryClient();

// Initialize Status Bar for mobile
const initializeStatusBar = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Set status bar style
      await StatusBar.setStyle({ style: Style.Default});
      
      // Set status bar background color (matching your header color)
      // await StatusBar.setBackgroundColor({ color: '#5B8FA3' }); // Adjust to match your blue header
      
      // Show the status bar
      await StatusBar.show();
      
      // Enable overlay mode to prevent content overlap
      await StatusBar.setOverlaysWebView({ overlay: false });
      
      console.log('Status bar initialized');
    } catch (error) {
      console.error('Error initializing status bar:', error);
    }
  }
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // console.log("CAPACITOR PLATFORM",Capacitor.getPlatform())

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/tabs/homepage" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/tabs"
        element={
          <ProtectedRoute>
            <TabsLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/tabs/homepage" replace />} />
        <Route path="homepage" element={<Homepage />} />
        <Route path="diario" element={<PatientDiary />} />
        <Route path="chatbot" element={<Chatbot />} />
        <Route path="profilo" element={<Profile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  // Initialize status bar on app load
  useEffect(() => {
    initializeStatusBar();
  }, []);

  return(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
)
};

export default App;
