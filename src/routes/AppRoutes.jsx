import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Main from '../layouts/Main';

// Route Guards
import ProtectedRoute from './ProtectedRoute';

// Pages
import Home from '../pages/home/Home';
import Places from '../pages/places/Places';
import PlaceDetails from '../pages/places/PlaceDetails';
import Provinces from '../pages/provinces/Provinces';
import Categories from '../pages/categories/Categories';
import Events from '../pages/events/Events';
import Galleries from '../pages/galleries/Galleries';
import Favorites from '../pages/favorites/Favorites';
import Achievements from '../pages/achievements/Achievements';
import Profile from '../pages/profiles/Profile';
import Notifications from '../pages/notifications/Notifications';
import DeletionRequests from '../pages/delete/DeletionRequests';
import Settings from '../pages/settings/Settings';
import Login from '../pages/auth/Login';
import Trips from '../pages/trips/Trips';
import TripDetails from '../pages/trips/TripDetails';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Application Layout with Navigation & Footer */}
        <Route element={<Main />}>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/places" element={<Places />} />
          <Route path="/places/:id" element={<PlaceDetails />} />
          <Route path="/provinces" element={<Provinces />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<Events />} />
          <Route path="/gallery" element={<Galleries />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Pages (Strictly Requires Tourist Authentication) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/trips" element={<Trips />} />
            <Route path="/trips/:id" element={<TripDetails />} />
            <Route path="/wishlist" element={<Favorites />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/deletion-request" element={<DeletionRequests />} />
            <Route path="/delete" element={<DeletionRequests />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
