import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRoutes from './routes/AppRoutes';
import './styles/globals.css';
import { AuthProvider } from './context/AuthContext';
import { TravelProvider } from './context/TravelContext';
import { AlertProvider } from './context/AlertContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '354228945620-gkh32809u182sksd.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AlertProvider>
        <AuthProvider>
          <TravelProvider>
            <AppRoutes />
          </TravelProvider>
        </AuthProvider>
      </AlertProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
