import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Main from '../layouts/Main';

// Route Guards
import ProtectedRoute from './ProtectedRoute';

// Public Pages
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

// Business Discovery Pages
import Businesses from '../pages/businesses/Businesses';
import BusinessDetails from '../pages/businesses/BusinessDetails';

// Business Owner Portal Pages
import BusinessDashboard from '../pages/business/BusinessDashboard';
import BusinessList from '../pages/business/BusinessList';
import BusinessForm from '../pages/business/BusinessForm';
import BusinessManage from '../pages/business/BusinessManage';
import BusinessAnalytics from '../pages/business/BusinessAnalytics';

// Guide / Editor Portal Pages
import GuideDashboard from '../pages/guide/GuideDashboard';
import GuidePlaces from '../pages/guide/GuidePlaces';
import GuidePlaceForm from '../pages/guide/GuidePlaceForm';
import GuideEvents from '../pages/guide/GuideEvents';
import GuideEventForm from '../pages/guide/GuideEventForm';
import GuideGallery from '../pages/guide/GuideGallery';
import GuideInquiries from '../pages/guide/GuideInquiries';
import GuideReviews from '../pages/guide/GuideReviews';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Application Layout */}
        <Route element={<Main />}>
          
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/places" element={<Places />} />
          <Route path="/places/:id" element={<PlaceDetails />} />
          <Route path="/businesses" element={<Businesses />} />
          <Route path="/businesses/:id" element={<BusinessDetails />} />
          <Route path="/provinces" element={<Provinces />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<Events />} />
          <Route path="/gallery" element={<Galleries />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/login" element={<Login />} />

          {/* General Protected Tourist Pages */}
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

          {/* Business Owner Dedicated Portal */}
          <Route element={<ProtectedRoute allowedRoles={['business_owner', 'admin', 'super_admin']} />}>
            <Route path="/business/dashboard" element={<BusinessDashboard />} />
            <Route path="/business/businesses" element={<BusinessList />} />
            <Route path="/business/businesses/new" element={<BusinessForm />} />
            <Route path="/business/businesses/:id" element={<BusinessManage />} />
            <Route path="/business/businesses/:id/edit" element={<BusinessForm />} />
            <Route path="/business/analytics" element={<BusinessAnalytics />} />
          </Route>

          {/* Guide / Editor Dedicated Portal */}
          <Route element={<ProtectedRoute allowedRoles={['guide_editor', 'admin', 'super_admin']} />}>
            <Route path="/guide/dashboard" element={<GuideDashboard />} />
            <Route path="/guide/places" element={<GuidePlaces />} />
            <Route path="/guide/places/new" element={<GuidePlaceForm />} />
            <Route path="/guide/places/:id/edit" element={<GuidePlaceForm />} />
            <Route path="/guide/events" element={<GuideEvents />} />
            <Route path="/guide/events/new" element={<GuideEventForm />} />
            <Route path="/guide/events/:id/edit" element={<GuideEventForm />} />
            <Route path="/guide/gallery" element={<GuideGallery />} />
            <Route path="/guide/inquiries" element={<GuideInquiries />} />
            <Route path="/guide/reviews" element={<GuideReviews />} />
          </Route>

        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
