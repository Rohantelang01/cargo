# Cargo — Current Folder Structure & Details
*Last Updated: March 2026*

This document outlines the current directory structure of the Cargo project and explains the purpose of each major folder and file.

---

## 📁 Root Directory (`/cargo`)

### 1. 📂 `app/` (Next.js App Router)
This folder contains all the pages (UI) and API routes (Backend) for the application.

*   **`api/`** (Backend Endpoints)
    *   `auth/`: Handles user registration, login, logout, and session validation (`route.ts`).
    *   `admin/`: Endpoints for the super-admin (stats, user management, bookings oversight).
    *   `bookings/`: Core booking logic (`find-ride`, `create-prebooking`, `confirm-pair`).
    *   `find-ride/`: Specific endpoint for querying matching pairs based on coordinates.
    *   `dashboard/`: Fetches role-specific data for the unified dashboard (requests, trips, earnings).
    *   `drivers/`: Endpoints for managing driver licenses, status, and rates.
    *   `vehicles/`: Endpoints for managing vehicle assets, specs, and per-km rates.
    *   `users/`: Generic user management and lookup APIs.
    *   `map/`: Geocoding and location-based logic helpers.
    *   `profile/`: User profile updates (name, phone, avatar uploads).
    *   `upload/`: Handles direct secure file uploads to Cloudinary (documents & images).
    *   `wallet/`: Fetches user balance and handles escrow/transaction logic.
    *   `test-db/`: Internal utility for database connection testing.
*   **`admin-panel/`** (Admin UI)
    *   Restricted area for admins to monitor platform activity and verify documents.
*   **`dashboard/`** (Unified Dashboard UI)
    *   `layout.tsx`: The main dashboard shell containing the dynamic sidebar.
    *   `page.tsx`: Redirects users to the overview based on their role.
    *   `overview/`: Main dashboard landing page with summary stats.
    *   `requests/`: Interface for drivers and owners to manage incoming booking pings.
    *   `trips/`: Management page for active and upcoming journeys.
    *   `earnings/`: Financial overview for drivers and owners.
    *   `history/`: Comprehensive log of all completed/cancelled past trips.
    *   `admin/`: Specialized dashboard view for internal platform workers.
*   **`find-ride/`** (Booking UI)
    *   The main interface for searching and selecting rides/pairs.
*   **`login/` & `signup/`** (Authentication Pages)
    *   User-facing pages for signing in and creating new accounts.
*   **`profile/`** (Profile UI)
    *   Page for users to edit personal details and manage their specific role forms.
*   **`wallet/`** (Wallet UI)
    *   Page displaying `addedBalance` and `generatedBalance` with transaction history.
*   **`about/` & `contact/`** (Static Pages)
    *   Information pages about the Cargo platform.
*   **`globals.css`**
    *   Global stylesheet including Tailwind directives and CSS variables for the theme.

---

### 2. 📂 `components/`
Contains reusable React UI components.

*   **`admin/`**: Components specifically for the admin dashboard (e.g., user verification cards).
*   **`auth/`**: Components like `LoginForm`, `RegisterForm`, and `RoleSelection` toggles.
*   **`common/`**: Generic, frequently used components (e.g., loading spinners, specialized buttons).
*   **`dashboard/`**: Chunks of the dashboard UI (e.g., `StatCard`, `VehicleList`, `RequestItem`).
*   **`find-ride/`**: Specialized components for the booking workflow (e.g., `PairList`, `RideEstimate`).
*   **`footer/` & `navbar/`**: Global layout components.
*   **`map/`**: The complex `LeafletMap` component used for selecting pickup/drop locations.
*   **`profile/`**: Components for editing user data and uploading documents.
*   **`ui/`**: Specialized components from `shadcn/ui` (e.g., `Dialog`, `Select`, `Toast`, `Badge`).
*   **`wallet/`**: Components for displaying balances and transaction lists.

---

### 3. 📂 `context/`
React Context providers for global state management.

*   `AuthContext.tsx`: Manages the logged-in user's state globally across the app.
*   `DashboardContext.tsx`: Shares dashboard-specific state (like current selected tab or active role view) across dashboard sub-components.
*   `WalletContext.tsx`: Fetches and stores the user's live wallet balances so the header and wallet page stay in sync.

---

### 4. 📂 `hooks/`
Custom React Hooks to encapsulate reusable state logic.

*   `useAuth.ts`: Shortcut hook to access the AuthContext.
*   `useDashboardRequests.ts`: Fetches and manages pending booking requests.
*   `useDashboardStats.ts`: Fetches summary statistics for the dashboard overview.
*   `useDashboardTrips.ts`: Manages active/past trip data.
*   `useTheme.tsx`: Handles Light/Dark mode toggling.
*   `useWallet.tsx`: Handles fetching and mutating wallet data.

---

### 5. 📂 `lib/`
Utility functions, database connection, and backend service logic. *Code here is primarily used by the API routes.*

*   `mongoose.ts`: Handles the connection to the MongoDB Atlas database.
*   `authService.ts`: Helper functions for JWT creation, verification, and password hashing.
*   `driverService.ts`: Logic for handling driver specific operations.
*   `profileService.ts`: Logic for updating user profiles.
*   `walletService.ts`: Crucial financial logic for handling atomic escrow blocks, platform commissions, and refunds.

---

### 6. 📂 `models/`
Mongoose Database Schemas defining the structure of MongoDB collections.

*   `User.ts`: Defines the user document, including `driverInfo`, `ownerInfo`, and `requestLimits`.
*   `Vehicle.ts`: Defines vehicle assets and the `selfDriven` flag.
*   `BookingRequest.ts`: The temporary 60-sec or 24-hr request ping sent to drivers/owners.
*   `Booking.ts`: The finalized, agreed-upon booking pair.
*   `Trip.ts`: The actual active ride containing GPS logs and timestamps.
*   `Wallet.ts` & `Transaction.ts`: Financial ledger records.
*   `Review.ts`: Rating system schemas.
*   `Notification.ts`: System alerts and push messages.

---

### 7. 📂 `types/`
TypeScript definition files. Ensures data consistency between the frontend and backend.

*   `index.d.ts`: Global module declarations.
*   `auth.ts`, `driver.ts`, `admin.ts`, `profile.ts`, `wallet.ts`, `home.ts`: Interfaces for API requests, responses, and component props related to these domains.

---

### 8. 📂 `scripts/`
Standalone Node.js scripts used for database maintenance and testing (not part of the daily app runtime).

*   `seed.ts`: Populates the database with dummy users/vehicles for testing.
*   `clear-db.ts`: Wipes the database clean during development.
*   `create-admin.js`: Utility to manually force a user's role to `admin` in the DB.
*   `migrate-models.ts`: Script to update old database records to new schema formats.

---

### 9\. 📂 `public/`
Static assets served directly by the browser.
*   **`cargo_logo.png` & `cargo_logo2.png`**: Primary brand assets.
*   **`fonts/`**: Local font files for the application.
*   **`placeholder-user.jpg`**: Default image used when a user hasn't uploaded an avatar.

---

### 10\. 📂 `data/`
Static JSON data files used by the application logic.
*   **`locations.json`**: Contains pre-defined location data (towns, districts) for search suggestions and pricing calculations.

---

### 11\. 📄 Important Configuration Files (Root Level)

*   **`middleware.ts`**: The Next.js security layer. It intercepts every request to protected routes (`/dashboard`, `/wallet`, `/admin-panel`) and verifies the JWT cookie before allowing access.
*   **`next.config.mjs`**: Next.js framework configuration (e.g., allowed image domains like Cloudinary).
*   **`tailwind.config.ts`**: Defines the design system (custom colors, fonts, breakpoints) for Tailwind CSS.
*   **`.env` / `.env.local`**: Environment variables (MongoDB connection string, JWT secrets, Cloudinary API keys). *These are never committed to GitHub.*
*   **`package.json`**: Lists all npm dependencies (React, Mongoose, Bcrypt, Leaflet) and project scripts (`npm run dev`).
*   **`cargo_rulebook_v2.md` & `cargo_trip_flow_v2.md`**: Core business logic and architectural rule documentation.
*   **`Cargo_Thesis_Structure.md`**: The master thesis document representing the entire academic report.
