import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Main from '../layouts/Main';

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
import DeletionRequests from '../pages/delete/DeletionRequests';
import Settings from '../pages/settings/Settings';
import Login from '../pages/auth/Login';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Application Layout with Navigation & Footer */}
        <Route element={<Main />}>
          <Route path="/" element={<Home />} />
          <Route path="/places" element={<Places />} />
          <Route path="/places/:id" element={<PlaceDetails />} />
          <Route path="/provinces" element={<Provinces />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<Events />} />
          <Route path="/gallery" element={<Galleries />} />
          <Route path="/wishlist" element={<Favorites />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/deletion-request" element={<DeletionRequests />} />
          <Route path="/delete" element={<DeletionRequests />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
