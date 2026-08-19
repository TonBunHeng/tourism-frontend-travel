import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRoutes from './routes/AppRoutes';
import './styles/globals.css';
import { AuthProvider } from './context/AuthContext';
import { TravelProvider } from './context/TravelContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '354228945620-gkh32809u182sksd.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <TravelProvider>
          <AppRoutes />
        </TravelProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
