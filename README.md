# 🧭 Tourist Web App (`tourism-travel`)

Clean, simple, and high-performance Tourist Web frontend for the **AngkorVerses — Kingdom of Cambodia**.

The architecture and folder structure follow the exact conventions of **`tourism-frontend`** with dedicated `services/`, `layouts/`, `routes/`, `context/`, `styles/`, and modular `pages/` folders.

---

## 🏛️ Project Directory Structure

```text
tourism-travel/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx        # Navigation bar & search
│   │   │   └── Footer.jsx        # Emergency hotlines & footer links
│   │   ├── common/
│   │   │   ├── PlaceCard.jsx     # Attraction card with wishlist toggle
│   │   │   ├── EventCard.jsx     # Event card with date badge
│   │   │   ├── ProvinceCard.jsx  # Province directory card
│   │   │   └── AuthModal.jsx     # Login / Register dialog
│   │   ├── reviews/
│   │   │   └── ReviewModal.jsx   # 5-star rating & review submission dialog
│   │   └── chat/
│   │       └── ChatWidget.jsx    # Floating live support assistant
│   ├── layouts/
│   │   └── Main.jsx              # Application layout wrapper
│   ├── routes/
│   │   └── AppRoutes.jsx         # React Router application routes
│   ├── services/
│   │   ├── api.js                # Axios HTTP client with Bearer token interceptors
│   │   ├── authService.js        # Authentication & profile endpoints
│   │   ├── placeService.js       # Destinations & attractions
│   │   ├── provinceService.js    # 25 Cambodian provinces
│   │   ├── categoryService.js   # Tourism themes & categories
│   │   ├── eventService.js       # Cultural events & festivals
│   │   ├── galleryService.js     # Media photo & video library
│   │   ├── reviewService.js      # Tourist ratings & reviews
│   │   ├── favoriteService.js    # Wishlist & visited destinations
│   │   ├── chatService.js        # Support chat & messaging
│   │   ├── achievementService.js # Gamified explorer badges
│   │   ├── deletionRequestService.js # GDPR data deletion requests
│   │   └── settingService.js     # Emergency hotlines & public settings
│   ├── context/
│   │   ├── AuthContext.jsx       # User authentication state
│   │   └── TravelContext.jsx     # Global wishlist & toast state
│   ├── pages/
│   │   ├── home/                 # Home.jsx, HomeHero.jsx
│   │   ├── places/               # Places.jsx, PlacesHeader.jsx, PlacesToolbar.jsx, PlacesGrid.jsx, PlaceDetails.jsx
│   │   ├── provinces/            # Provinces.jsx, ProvincesHeader.jsx, ProvincesGrid.jsx
│   │   ├── categories/           # Categories.jsx, CategoriesHeader.jsx, CategoriesGrid.jsx
│   │   ├── events/               # Events.jsx, EventsHeader.jsx, EventsGrid.jsx
│   │   ├── galleries/            # Galleries.jsx, GalleriesHeader.jsx, GalleriesGrid.jsx
│   │   ├── favorites/            # Favorites.jsx, FavoritesHeader.jsx, FavoritesGrid.jsx
│   │   ├── achievements/         # Achievements.jsx, AchievementsHeader.jsx, AchievementsGrid.jsx
│   │   ├── profiles/             # Profile.jsx, ProfileHeader.jsx
│   │   ├── delete/               # DeletionRequests.jsx, DeletionHeader.jsx
│   │   ├── settings/             # Settings.jsx, SettingsHeader.jsx
│   │   └── auth/                 # Login.jsx
│   ├── styles/
│   │   └── globals.css           # Theme colors, CSS variables & animations
│   ├── App.jsx
│   └── main.jsx
```

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```
