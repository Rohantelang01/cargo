**SUSHGANGA POLYTECHNIC, WANI**

Department of Computer Technology

Diploma in Computer Technology  |  Session 2024–2025

**PROJECT REPORT ON**

**CARGO**

*The Smart Transport Aggregator Platform*

**SUBMITTED BY**

Rohan Rathod

Aditya Khaire

Ayush Kambale

**GUIDED BY**

Miss Diksha Hiware

H.O.D: Mrs. Shamli Kadu



**Table of Contents**

|**Sr.No**|**Chapter**|Sub-Topics|Page|
| :-: | :- | :- | :-: |
|**—**|Certificate|<p>Institution Certificate</p><p>Examiner Signature</p>|i|
|**—**|Declaration|Student Declaration|ii|
|**—**|Acknowledgement|Gratitude Note|iii|
|**—**|Abstract|Project Summary|iv|
|**1**|Introduction|<p>1\.1  Project Background</p><p>1\.2  Problem Statement</p><p>1\.3  Proposed Solution</p><p>1\.4  Project Scope</p><p>1\.5  Report Organization</p>|1|
|**2**|Objectives & Target Users|<p>2\.1  Primary Objectives</p><p>2\.2  Target User Groups (The 4 Roles)</p><p>2\.3  Expected Outcomes</p>|5|
|**3**|Literature Survey|<p>3\.1  Existing Systems Review</p><p>3\.2  Comparative Analysis</p><p>3\.3  Research Gap Identified</p>|8|
|**4**|System Design & Architecture|<p>4\.1  System Architecture Overview</p><p>4\.2  Role-Based Access Control (RBAC)</p><p>4\.3  Component Architecture</p><p>4\.4  Database Design (MongoDB Schemas)</p><p>4\.5  API Architecture</p><p>4\.6  Authentication Flow</p><p>4\.7  Booking & Trip Flow</p><p>4\.8  Pricing & Escrow Model</p><p>4\.9 Anti-Spam & Request Limits</p>|12|
|**5**|Technology Stack|<p>5\.1  Frontend Technologies</p><p>5\.2  Backend Technologies</p><p>5\.3  Database</p><p>5\.4  Dev Tools & Deployment</p><p>5\.5  Why This Stack?</p>|22|
|**6**|Implementation|<p>6\.1  Authentication & Profile System</p><p>6\.2  Unified Dashboard System</p><p>6\.3  Ride Booking UI (Find Ride)</p><p>6\.4  Wallet System</p><p>6\.5  Admin Panel</p><p>6\.6  Key Code Snippets</p>|27|
|**7**|Features & Modules|<p>7\.1  Implemented Features</p><p>7\.2  Features In Development</p><p>7\.3  Planned Features</p><p>7\.4  Module Interaction Flow</p>|45|
|**8**|Testing|<p>8\.1  Testing Strategy</p><p>8\.2  Booking Limits & Spam Protection Testing</p><p>8\.3  Admin Panel Testing</p><p>8\.4  Test Cases Table</p>|52|
|**9**|Results & Screenshots|<p>9\.1  Landing Page & Authentication</p><p>9\.2  Unified Dashboard</p><p>9\.3  Ride Booking Interface</p><p>9\.4  Wallet System</p><p>9\.5  Admin Controls</p>|57|
|**10**|Future Development|<p>10\.1  Phase 2 — Core Operations</p><p>10\.2  Phase 3 — Scale, Real-Time & Mobile</p><p>10\.3  Long-term Vision</p>|63|
|**11**|Conclusion|<p>11\.1  Summary</p><p>11\.2  Learning Outcomes</p><p>11\.3  Project Impact</p>|66|
|**—**|Bibliography / References|Tools, Frameworks, Documentation Used|68|



# Chapter 1 — Introduction
-----
## 1\.1 Project Background
Transportation has always been an essential part of daily life. In recent years, technology has changed how people travel and move goods from one place to another. Platforms like Ola and Uber have shown that connecting passengers with drivers through a simple app can solve real problems. But these platforms are mostly focused on big cities and they work in a very controlled way — the platform decides the pricing, the driver just follows the rules, and the vehicle owner has very little say in how their asset is used.

When we started thinking about Cargo, we had a different idea. We noticed that in many areas across India, local transport is still very unorganized. Passengers don't know which vehicles are available, drivers don't have a reliable way to find customers, and vehicle owners have no system to manage their fleet. Everything depends on word of mouth or phone calls.

We also felt that existing platforms are too platform-centric. The driver has little freedom. The owner has no visibility. The passenger just hopes for the best. So we thought — what if we build something where all local transport stakeholders can communicate directly and work things out on their own terms? That was the original idea behind Cargo.

-----
## 1\.2 Problem Statement
The main problems we identified are:

**Lack of reliable local transport booking:** Passengers in non-metro areas have no reliable way to book transport. They either have to call someone they know or wait on the roadside. There is no way to check vehicle availability, pricing, or driver details in advance.

**No platform for drivers and owners:** Drivers and vehicle owners have no platform to reach customers. They rely on daily luck or personal contacts to get work. There is no system to track trips, earnings, or history.

**Centralized, inflexible pricing:** Existing platforms use fixed pricing models decided by the platform itself. This does not work well across different regions of India where transport costs vary significantly based on road conditions, local economy, and fuel prices. A rate that makes sense in one area may be completely impractical in another.

**Vehicle underutilization & Complex Ecosystem:** Many people own vehicles but cannot drive them full time. These vehicles sit idle for most of the day generating no income. On the other side, there are people who want to earn through transport services but do not own a vehicle. Furthermore, those who own AND drive their vehicles (Self Drivers) face competition from pairs of drivers and owners. There is currently no easy way for these different groups to work efficiently.

**No unified multi-purpose transport platform:** There is no single platform that handles passenger rides, goods delivery, and vehicle rentals together under one system. Existing apps fragment these use cases.

-----
## 1\.3 Proposed Solution
Cargo is a web-based transport aggregator platform that acts as a **neutral middleman** — connecting passengers, drivers, and vehicle owners while dynamically adapting to the user's specific role in the ecosystem.

### Key Features That Make Cargo Different

### 💡 Driver and Owner Controlled Pricing
Unlike platforms that fix rates centrally, **Cargo allows drivers and vehicle owners to set their own charges** independently.
- Drivers set their **hourly rate** (compensation for their time).
- Owners set a **per-km rate** (compensation for vehicle wear and tear).
- Passengers see the combined fare upfront.

This flexibility makes the platform genuinely useful across diverse geographies — something no existing major platform offers at the local level.

### 🔄 Advanced Role Architecture
Cargo introduces a nuanced 4-role system to closely mirror real-world transport economics:
1. **Passenger**: Books rides.
2. **Pure Driver**: Has a license, rents a vehicle through the platform to complete a trip.
3. **Pure Owner**: Owns a vehicle, rents it out through the platform.
4. **Self Driver (Combo)**: Owns the vehicle and drives it. They collect both the hourly rate and the per-km rate, making their service naturally more competitive.

### 🚗 Vehicle Rental Ecosystem Built-In
Cargo natively supports pairing Drivers without vehicles and Owners who don't want to drive. During prebooking, the system automatically finds compatible Driver + Owner pairs based on license type and vehicle class, effectively facilitating a short-term rental for a specific trip.

### 🤝 Fair Cancellation & Pickup System
Cargo implements a unique **Pickup Charge** model. When a driver travels to a pickup location, they incur costs. If a passenger cancels after the driver starts moving, the system guarantees a pre-calculated pickup charge is paid to the driver and owner, protecting them from losses common on other platforms.

-----
## 1\.4 Project Scope

### ✅ Currently Implemented

|**Module**|**Status**|**Details**|
| :-: | :-: | :-: |
|Authentication System|Complete|JWT-based, HTTP-only cookies, secure login/logout|
|Role-Based Access|Complete|Passenger, Driver, Owner, Admin — database driven|
|Unified Dashboard|Complete|Role-aware dashboard (overview, requests, trips, earnings, history)|
|Profile Management|Complete|Profile editing, multi-license support, multi-vehicle support, Cloudinary image upload|
|Booking UI (Find Ride)|Complete|Ride booking interface, live location selection, complex pairing logic|
|Booking API Core|Complete|Pair generation, Prebooking creation, Confirm pair endpoints|
|Wallet System|Complete|Wallet UI, context, and service logic implemented|
|Admin Panel|Complete|User management, booking management, dashboard stats|
|Request Limiting|Complete|Anti-spam protection, batch limits (instant/prebooking)|
|Database Design|Complete|9 schemas — Users, Vehicles, Bookings, RequestLimits, Wallets, Trips, Reviews, Notifications|

### 🚧 Planned for Next Phase (Phase 1 Completion)
- Actual booking request flow APIs (Driver/Owner accept/reject → Passenger confirm)
- Trip Start & End APIs (calculating actuals)
- Payment gateway integration (Razorpay / Stripe)
- Full cancellation flow implementation
- OTP verification (MSG91)

-----
## 1\.5 Report Organization
This report is organized into eleven chapters:

|**Chapter**|**Title**|**Description**|
| :-: | :-: | :-: |
|1|Introduction|Background, problem, solution, scope|
|2|Objectives & Target Users|What Cargo aims to achieve and who it serves|
|3|Literature Survey|Existing systems and how Cargo is different|
|4|System Design & Architecture|Database design, RBAC, API architecture, flows|
|5|Technology Stack|Technologies used and reason behind each choice|
|6|Implementation|Actual code and working modules|
|7|Features & Modules|Complete and planned feature list|
|8|Testing|Test cases, anti-spam validation|
|9|Results & Screenshots|Working system screenshots|
|10|Future Development|Next phases and long-term vision|
|11|Conclusion|Summary and learning outcomes|

-----
*Chapter 1 — End*

# Chapter 2 — Objectives & Target Users
-----
## 2\.1 Primary Objectives
The main goal of Cargo is to create a transport platform that actually works for everyone involved — not just the passenger, but also the driver and the vehicle owner. Most existing platforms treat drivers as resources; Cargo is built around the idea that all parties matter equally.

These are the core objectives we set for this project:

**Create a unified transport platform:** Build one platform that handles passenger rides, goods transport, and vehicle rentals — so users don't need different apps for different needs.

**Give pricing control to drivers and owners:** Let drivers and vehicle owners set their own rates based on their area, vehicle type, and operating costs. The platform should never force a fixed base rate on them.

**Accurately model real-world transport roles:** Differentiate between someone who only drives, someone who only owns a fleet, and someone who does both (Self-Driver). The economics for these groups are different and the platform must reflect that.

**Act as a transparent facilitator, not a controller:** The platform's job is to connect people, calculate fair minimums, and let the market dictate the final pairs based on distance and price.

**Build inherently secure and anti-spam systems:** Prevent abuse common on mobility platforms through strict rate-limiting and reputation monitoring from day one.

-----
## 2\.2 Target User Groups (The 4 Roles)
Cargo's database stores 3 fundamental roles (Passenger, Driver, Owner), but creatively combines them to present 4 distinct user types in the interface.

### 🟢 Passengers
**Who they are:** Anyone who needs to travel or send goods from one place to another.
**What they can do:**
- Search for available transport (Instant or Prebooking).
- View up-front price estimates before confirming.
- Select from a generated list of Self-Drivers or Driver+Owner pairs.
- Pay via Wallet (Online) or Cash.

### 🔵 Pure Drivers
**Who they are:** Individuals with a valid driving license but no vehicle of their own.
**What they can do:**
- Register multiple licenses (e.g., LMV for cars, MCG for bikes).
- Set an **hourly rate** for their driving services.
- Receive Prebooking requests paired automatically with available Owners.
- Earn a 'driver payout' consisting of their hourly rate portion + 60% of any pickup charges.

### 🟠 Pure Owners
**Who they are:** Individuals or small businessmen who own vehicles but don't drive them for hire.
**What they can do:**
- List multiple vehicles on the platform.
- Set a **per-km rate** for the usage of their vehicle.
- Receive Prebooking requests where a Pure Driver will operate their vehicle.
- Earn an 'owner payout' consisting of their per-km rate portion + 40% of any pickup charges.

### 🟣 Self Drivers
**Who they are:** The traditional cab/auto driver who owns the vehicle they drive.
**How they are modeled:** They possess *both* Driver and Owner roles, and their vehicle is marked with `selfDriven: true`.
**What they can do:**
- Accept **Instant Bookings** (since they are ready with the vehicle immediately).
- Accept Prebookings.
- Collect **both** the hourly rate and the per-km rate.
- Collect 100% of any pickup charges.
**Market Advantage:** Because they consolidate the travel costs of a Driver getting to an Owner, Self Drivers naturally offer cheaper fares to Passengers, aligning with real-world economics.

-----
## 2\.3 Expected Outcomes
By classifying these user groups correctly and giving them control, Cargo aims to:

- **Surface true market rates** in Tier-2 and Tier-3 areas where algorithms fail to capture local nuance.
- **Unlock idle assets** by creating a reliable ecosystem for Pure Owners and Pure Drivers to collaborate safely.
- **Protect vehicle operators** through guaranteed pickup-charge coverage in case of passenger cancellation.

-----
*Chapter 2 — End*

# Chapter 3 — Literature Survey
-----
## 3\.1 Introduction
Before building Cargo, we studied the existing transport platforms in India to understand what is already available, what works well, and what gaps still exist. This chapter covers four major platforms — Ola, Uber, Rapido, and Porter — and compares their features with Cargo's proposed model.

-----
## 3\.2 Existing Systems Review

### 3\.2.1 Ola & Uber
**Type:** Ride-hailing (cabs, autos, bikes) | **Coverage:** Major Indian cities
Ola and Uber dominate the Indian urban mobility market. They connect passengers with drivers via mobile apps, providing real-time tracking, upfront fare estimates, and digital payments.

**Recent Shift (2025):** Both platforms recently shifted some drivers to a "zero-commission" SaaS model (e.g., flat daily subscription fee instead of per-trip commission) following widespread driver protests regarding unfair earnings.

**Limitations:**
- Highly metro-focused.
- Algorithm-controlled pricing. Even in a zero-commission model, the *base fare* is dictated by the platform or government, not the driver's specific operational costs.
- No rental ecosystem. Owners cannot easily lease their vehicle to verified drivers per-trip within the app ecosystem.

### 3\.2.3 Rapido
**Type:** Bike taxi, auto, cab, logistics | **Coverage:** 100+ cities
Rapido revolutionized the two-wheeler taxi market and successfully expanded into Tier-2 and Tier-3 cities. They also moved heavily into the SaaS subscription model in early 2025.

**Limitations:**
- Pricing still centrally managed.
- Primarily focused on short intracity trips.
- Lacks a unified multi-vehicle ecosystem (passengers and goods) or rental capability.

### 3\.2.4 Porter
**Type:** Goods transport | **Coverage:** 22+ cities
Porter is India's leading goods transport aggregator, offering transparent pricing for trucks, tempos, and bikes moving goods.

**Limitations:**
- Strictly goods transport; no passenger integration.
- Platform-set pricing.
- No vehicle rental marketplace for owners and drivers to connect securely.

-----
## 3\.3 Comparative Analysis
The table below compares the platforms with Cargo based on key features:

|**Feature**|**Ola/Uber**|**Rapido**|**Porter**|**Cargo**|
| :-: | :-: | :-: | :-: | :-: |
|Passenger rides|✅|✅|❌|✅|
|Goods transport|Limited|Partial|✅|✅ (Planned)|
|Driver sets own rates|❌|❌|❌|**✅**|
|Owner sets own rates|❌|❌|❌|**✅**|
|Earn without owning vehicle|❌|❌|❌|**✅**|
|Rural / non-metro focus|Limited|Growing|Limited|**✅**|
|Zero commission / Low flat fee|✅ (2025)|✅ (2025)|❌|**✅**|
|Distinct Driver vs Owner roles|❌|❌|❌|**✅**|

-----
## 3\.4 Research Gap Identified
Our survey identified several critical gaps:

**1. No Independent Pricing Control:** 
All major platforms govern fares centrally. In non-metro areas with varying road conditions and operational costs, a fixed algorithm creates inefficiencies. Cargo fills this by allowing drivers (hourly) and owners (per-km) to set personal rates.

**2. Lack of a Short-Term Rental Ecosystem:**
If an individual has a commercial driving license but no vehicle, they must arrange informal rentals outside existing apps. Cargo builds this pairing process directly into the Prebooking flow.

**3. Fragmented Services:**
Users currently juggle apps (Ola for cabs, Porter for goods, specialized apps for rentals). Cargo unifies these into one platform.

**4. Driver Protection on Cancellations:**
Current platforms offer negligible compensation to drivers if a passenger cancels after the driver has traveled significant distance. Cargo calculates a transparent "Pickup Charge" upfront which is guaranteed if the driver is enroute.

-----
*Chapter 3 — End*
# Chapter 4 — System Design & Architecture
-----
## 4\.1 System Architecture Overview

Cargo is built on a modern **client-server architecture** using Next.js 15 App Router. The platform consolidates both the frontend user interface and the backend API logic within a single unified codebase.

At a high level, the system consists of three distinct layers:
1. **Presentation Layer (Client-Side Components):** Built with React and Tailwind CSS, this layer provides a unified dashboard interface that dynamically adapts based on the logged-in user's roles.
2. **Business Logic Layer (Server-Side APIs):** Built with Next.js API Routes (Node.js runtime), this layer handles authentication, complex pair generation algorithms, fare calculations, and payment escrow logic.
3. **Data Access Layer (MongoDB):** A NoSQL database hosted on MongoDB Atlas, selected for its flexibility in handling geospatial queries (essential for connecting drivers and passengers) and nested documents.

-----
## 4\.2 Role-Based Access Control (RBAC) & The 4 Roles

Cargo employs a hybrid RBAC system. While the database only stores three base roles, the frontend interface and business logic combine these to create four practical user experiences.

### 4.2.1 Database Roles Representation
Every user document in MongoDB contains a `roles` array:
- `["passenger"]` → Base user.
- `["passenger", "driver"]` → Added when the user submits their driving license details.
- `["passenger", "owner"]` → Added when the user registers a vehicle.
- `["passenger", "driver", "owner"]` → Contains both driving and vehicle-owning privileges.
- `["admin"]` → System administrators (internal use only).

### 4.2.2 The "Self Driver" Logic
The 4th role, **Self Driver**, is entirely derived. A user is treated as a Self Driver if and only if:
1. Their `roles` array includes both `"driver"` and `"owner"`.
2. They possess at least one vehicle marked with the boolean flag `selfDriven: true`.

When a vehicle is marked as `selfDriven: true`, the system automatically enforces strict rules:
- The `assignedDriver` field on the vehicle is hardcoded to the owner's ID.
- The vehicle is permanently reserved; it cannot be rented out to another Pure Driver.
- In booking scenarios, the system creates a "Combo Trip" (`isComboTrip: true`), directing both the driver payout (hourly rate) and owner payout (per-km rate) to the same wallet.

-----
## 4\.3 Component Architecture & Unified Dashboard

Initially planned as four separate dashboard routes (`/dashboard/passenger`, `/dashboard/driver`, etc.), Cargo's architecture was updated to a **Unified Dashboard Pattern** to eliminate code duplication and simplify state management.

All authenticated traffic routes to a single layout: `app/dashboard/layout.tsx`.

Inside this unified layout, the `Sidebar` reads the user's `roles` array and conditionally renders navigation items.
- If the user is a Passenger, they see "My Rides".
- If a Driver, they also see "Driving Requests".
- If an Owner, they see "Vehicle Management".

This architectural decision significantly reduced maintenance overhead, as common components (like the Wallet view or Profile updater) are written once and shared across all active roles.

-----
## 4\.4 Database Design (MongoDB Schemas)

The system relies on 9 interconnected MongoDB collections.

### 4.4.1 User Schema
Stores core profile data, credentials, roles, and role-specific sub-documents.
- **Top-Level Status:** `status` (Enum: `OFFLINE`, `ONLINE`, `ON_TRIP`). If a user goes `OFFLINE` or is `ON_TRIP`, all their licenses become unavailable for new bookings.
- **`driverInfo` Sub-document:** Contains an array of `licenses` (e.g., LMV, MCG), each with its own `hourlyRate`. Also stores `linkedVehicleId` to track which vehicle the pure driver is currently renting.

### 4.4.2 Vehicle Schema
Stores physical asset details.
- **Fields:** `make`, `model`, `plateNumber`, `vehicleType` (car/bike/etc.), `perKmRate`.
- **Status & Linking:** `status` (Enum: `OFFLINE`, `AVAILABLE`, `ON_TRIP`), `owner` (ObjectId), `assignedDriver` (ObjectId), and `selfDriven` (Boolean).
- **Location:** Uses GeoJSON `Point` coordinates representing the permanent address (where the vehicle is parked overnight).

### 4.4.3 Booking & Trip Schemas
- **BookingRequest:** Represents a *temporary* offer sent to drivers/owners. Contains an `expiresAt` timestamp (60 seconds for instant, or 24h before a prebooking).
- **Booking:** The canonical record created once a passenger confirms a pair. Tracks the overall status (`REQUESTED` → `ACCEPTED` → `ENROUTE` → `STARTED` → `COMPLETED` / `CANCELLED`).
- **Trip:** Created when the driver taps "Enroute". Contains real-time GPS coordinates, `startTime`, `endTime`, and calculated exact distances.

### 4.4.4 Financial Schemas
- **Wallet:** Created automatically on user registration. Contains two distinct balances:
  - `addedBalance`: Money added by the user via UPI (for passenger rides). Cannot be withdrawn.
  - `generatedBalance`: Earnings from driving or renting out vehicles. Can be withdrawn to a bank account.

-----
## 4\.5 Authentication Flow

1. **Registration/Login:** User submits credentials to `/api/auth/login`.
2. **JWT Creation:** The server verifies the password using `bcryptjs` and signs a JSON Web Token containing the user's ID and roles.
3. **Cookie Storage:** The token is serialized into an `httpOnly`, `secure` cookie. This prevents XSS attacks, as client-side JavaScript cannot access the token.
4. **Middleware Protection:** Next.js Middleware intercepts every request to protected routes (`/dashboard/*`, `/wallet/*`, `/admin-panel/*`). If the cookie is missing or invalid, the user is redirected to the login page.
5. **Role Enforcement:** API endpoints decrypt the token. If an endpoint requires `admin` privileges, the request is rejected immediately if the token lacks the admin role.

-----
## 4\.6 Booking & Trip Flow

### 4.6.1 Instant Booking (Self Drivers Only)
Because Instant Booking requires the driver and vehicle to be at the same location simultaneously, the system only queries the database for Self Drivers (`selfDriven: true`). Pure Drivers and Pure Owners mathematically cannot guarantee instantaneous co-location.
1. System runs a geospatial (`$near`) query against Self Drivers currently `ONLINE` and `AVAILABLE`.
2. Passenger sends up to 10 requests simultaneously. Lookups expire in 60 seconds.
3. Once a driver accepts, the passenger confirms and the system locks the estimated fare in escrow.

### 4.6.2 Prebooking (Pair Generation Algorithm)
Prebooking allows fixing a ride days in advance. Here, the system actively brokers short-term rentals between Pure Drivers and Pure Owners.
1. The system searches for active Drivers and Owners whose permanent addresses are near each other.
2. It validates that the Driver's License Type matches the Owner's Vehicle Class (e.g., matching an LMV license with a Car).
3. The system calculates a complex 5-leg estimated distance: Driver Home → Owner Home → Passenger Pickup → Passenger Drop → Owner Home.
4. If both the Driver and Owner independently accept the request, the Passenger confirms the pair.
5. On the day of the trip, the Driver picks up the vehicle, completes the passenger ride, and returns the vehicle to the Owner.

-----
## 4\.7 Pricing & Payment Escrow Model

Cargo does not utilize dynamic "surge" algorithms. Pricing is completely determinative based on user-set parameters.

### 4.7.1 Mathematical Fare Formula
Total Fare = (Driver's `hourlyRate` × Estimated Hours) 
           + (Owner's `perKmRate` × Pickup-to-Drop Km) 
           + (Platform Fee of ₹1 × Pickup-to-Drop Km)
           + Pickup Charge

### 4.7.2 The Guaranteed Pickup Charge
To protect drivers from financial loss on passenger cancellations, Cargo calculates a fixed Pickup Charge at the time of booking: (Distance from Driver's Home to Passenger Pickup) × ₹1 × 2 (round trip).
- If the passenger cancels *after* the driver has pressed "Enroute", this Pickup Charge is strictly deducted from their escrow and distributed (60% to Driver, 40% to Owner).
- If the trip completes normally, the passenger does not pay the pickup charge.

### 4.7.3 Escrow System
When a passenger confirms a booking, the total estimated fare is transferred from their `addedBalance` into a `BLOCKED` state.
- Platform components cannot access blocked funds.
- If the trip completes, the funds are split and moved to the Driver and Owner's `generatedBalance` wallets.
- If canceled within the free window, the funds are immediately unblocked and returned to the passenger.

-----
## 4\.8 Anti-Spam & Request Limiting

To prevent API abuse and network spam, Cargo implements strict limits explicitly within the `User` schema (`requestLimits` sub-document).
- **Instant Booking Limit:** A user can send a maximum of 10 driver requests within a 5-minute window.
- **Prebooking Limit:** A user can create a maximum of 5 active prebookings at any given time, and can only dispatch request batches once every 5 hours.
- A background Cron Job automatically flags and deletes "stale" PENDING requests (older than 60 seconds for instant, or within 24 hours of scheduled time for prebooking) to keep the database size manageable and driver dashboards clean.

-----
*Chapter 4 — End*
# Chapter 5 — Technology Stack
-----
## 5\.1 Frontend Technologies
Cargo’s user interface is built to be fast, responsive, and predictable.

- **Next.js 15 (App Router):** The foundation of the platform. Used for server-side rendering (SSR), optimized routing, and React Server Components (RSC) to minimize JavaScript sent to the client.
- **TypeScript:** Enforces strict type-checking across both the frontend components and backend API responses, drastically reducing runtime errors.
- **Tailwind CSS:** A utility-first CSS framework responsible for styling the application. It allows rapid prototyping and guarantees consistency without writing custom CSS files.
- **Shadcn/ui:** A collection of highly customizable, accessible React components (like Dialogs, Selects, and Tabs) built on top of Radix UI and Tailwind CSS.
- **React-Leaflet:** A React wrapper for Leaflet.js, used to render interactive maps for booking rides and tracking trips.

-----
## 5\.2 Backend Technologies
The backend is seamlessly integrated into the Next.js framework, avoiding the need for a separate Node.js server.

- **Next.js API Routes (Node.js runtime):** Handles all business logic, database queries, and data validation natively within the `/app/api/` directory.
- **JSON Web Tokens (JWT):** The stateless authentication mechanism. Tokens are created upon login, signed with a secret key, and passed via secure cookies.
- **Bcryptjs:** A cryptographic library used to hash and salt user passwords before storing them in the database, ensuring that even in a data breach, plain-text passwords cannot be extracted.
- **Cloudinary:** A cloud-based image management service. Used to securely upload, compress, and store user avatars, driving licenses, and vehicle Registration Certificates (RC).

-----
## 5\.3 Database
- **MongoDB Atlas:** A managed NoSQL cloud database. Selected over a traditional SQL database because:
  - The flexible schema perfectly accommodates the variable nature of user roles (where one user document might have a `driverInfo` sub-document today, and an `ownerInfo` sub-document tomorrow).
  - Its native `2dsphere` index support is critical for executing the geospatial `$near` queries required to locate nearby drivers.
- **Mongoose ODM:** An Object Data Modeling library used to enforce strict schemas, validation rules, and relationships between MongoDB collections at the application level.

-----
## 5\.4 Dev Tools & Deployment
- **ESLint & Prettier:** Used to maintain code quality, identify bad practices, and enforce consistent formatting across the codebase.
- **Turbopack:** Next.js's rust-based successor to Webpack, used for incredibly fast local development server reloads.
- **Vercel:** The platform where Cargo is hosted. Vercel automatically deploys the latest code from GitHub, manages SSL certificates, and serves assets globally via its edge network.

-----
## 5\.5 Why This Stack?
This specific "TALL" (Tailwind, API routes, Leaflet, Linux/MongoDB) stack was chosen because it maximizes developer velocity. Using Next.js allows the team to share TypeScript definitions (types) between the frontend and backend directly. This guarantees that if a database field name changes, the compiler will immediately highlight the error in the frontend UI, preventing bugs before they reach production.

-----
*Chapter 5 — End*

# Chapter 6 — Implementation
-----
This chapter breaks down exactly how the architecture planned in Chapter 4 was translated into actual, working software.

## 6\.1 Authentication & Profile System
The authentication system is built around stateless JWTs stored in `httpOnly` cookies. 

**Login Flow:**
When a user submits their credentials, the `/api/auth/login` endpoint validates the password using `bcrypt.compare()`. If successful, a JWT is generated containing the user's `_id` and `roles` array. This token is attached to a secure cookie.

**Route Protection:**
The `middleware.ts` file sits in front of all application requests. It executes before the page even renders:
```typescript
// middleware.ts concept
if (req.nextUrl.pathname.startsWith('/dashboard')) {
  const token = req.cookies.get('token');
  if (!token) return NextResponse.redirect(new URL('/login', request.url));
  // verifies token and role if necessary
}
```

**Profile Management:**
The `/profile` page calls the `profileService.ts` to fetch user data. Users can upload documents (like driving licenses or RC books) through a hidden file input. This file is sent via form-data to `/api/upload`, which immediately forwards the stream to Cloudinary, returning a secure image URL that is then saved to the user's MongoDB document.

-----
## 6\.2 Unified Dashboard System
The dashboard leverages Next.js Layouts. The `app/dashboard/layout.tsx` component is the shell. It fetches the user's roles from a React Context (`DashboardContext.tsx`) and conditionally renders the sidebar.

```tsx
// Conditional rendering in Sidebar based on roles array
{userRoles.includes('driver') && (
  <NavItem href="/dashboard/requests" label="Driving Requests" />
)}
{userRoles.includes('owner') && (
  <NavItem href="/dashboard/vehicles" label="Vehicle Fleet" />
)}
```
When a user clicks a tab, the content area (rendered via Next.js `children` prop) changes without reloading the sidebar or losing state.

-----
## 6\.3 Ride Booking Interface (Find Ride)
The Ride Booking UI is the most complex frontend module.
1. The user inputs their pickup and destination using an interactive Leaflet map.
2. The coordinates are sent to `/api/bookings/find-ride`.
3. The API executes a `$near` geospatial query against the `Vehicles` and `Users` collections.
4. The API calculates the 5-leg estimated distance using the MongoDB coordinates and multiplying by the respective `hourlyRate` and `perKmRate`.
5. The UI renders the returned list of Self-Drivers and Pair-Drivers sorted by total estimated cost.

-----
## 6\.4 Wallet System
The financial core is built directly into the app using a dedicated `Wallet` collection.

**Context Management:**
A globally available `WalletContext.tsx` wraps the application, allowing the UI header to display the user's real-time balances (`addedBalance` and `generatedBalance`) without needing to ping the server on every page load.

**Escrow Logging:**
When a trip is confirmed, the `/api/bookings/confirm` endpoint initiates a MongoDB transaction (to ensure atomicity). It deducts the amount from `addedBalance` and creates a `Transaction` document marked as `BLOCKED`. Only when the trip completes does the backend move these blocked funds to the driver's `generatedBalance` via another atomic transaction.

-----
## 6\.5 Admin Panel
The admin panel operates on the same unified codebase but is strictly protected by the `["admin"]` role.
- **User Management:** Admins can view all users, verify uploaded licenses/RC documents, and manually change a user's status to `ONLINE` or `OFFLINE` if they violate rules.
- **Booking Overview:** The admin dashboard displays real-time statistics fetched from aggregation pipelines inside MongoDB, summarizing total platform commission earned and active trips.

-----
*Chapter 6 — End*

# Chapter 7 — Features & Modules
-----
This chapter outlines the platform's capabilities categorized by delivery status. 

## 7\.1 Implemented Features (Live)

**1. Unified Authentication System**
- JWT-based login, signup, and logout.
- Secure, HTTP-only cookie management.
- Complete route protection based on database roles.

**2. 4-Role State Machine**
- Accurate modelling of Passengers, Pure Drivers, Pure Owners, and Self-Drivers.
- Dynamic tag evaluation (e.g., automatically labeling a user "Self Driver" if `selfDriven: true` flag is detected on their vehicle).

**3. Geo-Spatial Booking Engine**
- `find-ride` API capable of pairing isolated drivers and owners based on strict license-to-vehicle matching rules.
- Distance calculation algorithms computing 5-leg journeys for pure rentals.

**4. Wallet & Escrow Foundation**
- Functional UI for checking dual balances (`addedBalance` vs `generatedBalance`).
- Internal ledger system for tracking Escrow Blocks, Platform Commission deductions, and Driver/Owner payouts.

**5. Vehicle & Asset Management**
- Capability for Owners to register multiple vehicles.
- Capability for Drivers to register multiple license types (e.g., LMV and MCG simultaneously) with unique hourly rates for each.

**6. Super-Admin Controls**
- Comprehensive dashboard parsing MongoDB data into readable revenue metrics.
- User oversight, manual verification tools, and booking tracking.

-----
## 7\.2 Features In Development (Phase 1 Finalization)

**1. Booking Response Telemetry**
- The APIs allowing drivers and owners to click "Accept" or "Reject" on prebooking requests.
- The 60-second expiration ticker for instant bookings.

**2. Ride State Engine (Trip APIs)**
- The endpoints triggered when a driver clicks "Enroute", "Start Trip", and "End Trip".
- Real-time conversion of estimated fare to actual fare based on GPS termination metrics.

**3. Online Payment Gateway**
- Integration with Razorpay to allow users to legally add real money to their `addedBalance` via UPI or Netbanking.

-----
## 7\.3 Planned Features (Phase 2 & Beyond)

**1. MSG91 Integration (OTP)**
- Replacing the current dummy-number system with genuine SMS-based one-time-password validation upon signup and document submission.

**2. Real-Time WebSocket Tracking**
- Utilizing Socket.io to push real-time GPS coordinates from the driver's phone to the passenger's map screen once the trip reaches "Enroute" status.

**3. 3-Sided Review System**
- Implementing a complex rating matrix where Passengers rate Drivers/Owners, Drivers rate Passengers/Owners, and Owners rate Drivers/Passengers.
- Automatic suspension triggers if average ratings fall below 2.5 stars.

**4. Advanced Dispute Resolution**
- Automatically flagging massive discrepancies between Estimated Time of Arrival (ETA) and Actual GPS travel logs, halting automatic escrow payment and alerting Admin.

-----
*Chapter 7 — End*
# Chapter 8 — Testing
-----
## 8\.1 Testing Strategy
Testing Cargo required a multi-layered approach because of the intricate financial math and the 4-role state machine. The application was tested across three main pillars: Unit Testing (functions), Integration Testing (API flows), and Manual UI Testing.

-----
## 8\.2 Booking Limits & Spam Protection Testing
Given the platform's potential for abuse, anti-spam mechanisms were a primary testing focus.

**1. Instant Booking Limits:**
- **Test:** A user attempts to send 11 requests in 1 minute.
- **Expected:** The system strictly blocks the 11th request, returning a 429 error ("Maximum 10 requests per batch. Wait for expiry.").
- **Result:** Passed. The `requestLimits.instant.requestsInCurrentBatch` counter in MongoDB successfully tracked state.

**2. Prebooking Spacing:**
- **Test:** A user tries to create a new prebooking batch 2 hours after their last one.
- **Expected:** Blocked. The 5-hour cooldown window must complete entirely.
- **Result:** Passed.

**3. Automatic Expiration (Cron):**
- **Test:** 10 Instant Booking requests are ignored by drivers for 61 seconds.
- **Expected:** The background worker updates their status to `EXPIRED` automatically, clearing the driver's dashboard.
- **Result:** Passed. Both Passenger and Driver received accurate status updates without manual page refreshes.

-----
## 8\.3 Admin Panel Testing
The Admin Panel serves as the ultimate source of truth and overrides.

**1. Status Override Check:**
- **Test:** Admin manually switches a Driver's status from `ONLINE` to `OFFLINE`.
- **Expected:** The Driver instantly disappears from the `$near` geospatial matching query on the passenger side.
- **Result:** Passed. System security overrides appropriately.

**2. Analytics Accuracy:**
- **Test:** 3 test bookings are finalized, generating ₹120 in platform commission.
- **Expected:** The Admin dashboard exactly mirrors the sum of `BLOCKED` to `CREDIT` MongoDB transactions without a single rupee discrepancy.
- **Result:** Passed via Mongoose Aggregation pipelines.

-----
## 8\.4 Test Cases Table

| **Test Case ID** | **Module**     | **Description** | **Status** |
|:---:|:---|:---|:---:|
| TC01 | Auth | Login with invalid JWT token returns 401 | Pass |
| TC02 | Auth | Middleware redirects non-admin from `/admin-panel` | Pass |
| TC03 | Booking | Find-ride API strictly pairs LMV driver with Car | Pass |
| TC04 | Booking | Self Driver shows as single unit in results | Pass |
| TC05 | Wallet | Escrow deducts correctly from `addedBalance` | Pass |
| TC06 | UI | Dashboard correctly hides "Vehicles" tab from Pure Driver | Pass |
| TC07 | Map | Leaflet renders current location properly on mount | Pass |

-----
*Chapter 8 — End*

# Chapter 9 — Results & Screenshots
-----
*(Placeholder chapter: High-resolution screenshots of the working platform will be inserted here in the final printed document.)*

## 9\.1 Landing Page & Authentication
- Screenshot: The hero section highlighting Cargo's value proposition.
- Screenshot: The registration form with dynamic role-selection toggles.

## 9\.2 Unified Dashboard
- Screenshot: A Passenger's dashboard view (focusing on "My Rides").
- Screenshot: A Self Driver's dashboard displaying both "Driving Requests" and "Vehicle Management".

## 9\.3 Ride Booking Interface
- Screenshot: The interactive Leaflet map interface with destination selection.
- Screenshot: The list of generated pairs containing estimated fares split between hourly, per-km, and platform fees.

## 9\.4 Wallet System
- Screenshot: The dual-wallet UI displaying `Added Balance` vs `Generated Balance`.

## 9\.5 Admin Controls
- Screenshot: The Admin overview showing platform commission and active user metrics.

-----
*Chapter 9 — End*

# Chapter 10 — Future Development
-----
Cargo is currently in its MVP (Minimum Viable Product) phase. The core routing, authentication, pairing, and wallet foundations are solid. This chapter outlines the roadmap for expansion.

## 10\.1 Phase 2 — Core Operations (Live Launch)
Before public launch at the district level, the following features will be completed:

**The Complete Trip Flow:**
Moving a booking from `REQUESTED` to `ACCEPTED`, `ENROUTE`, `STARTED`, and `COMPLETED`. This involves the driver physically engaging with the app during the ride to trigger timezone-accurate timestamps for actual fare calculation.

**Razorpay Integration:**
Currently, wallet top-ups are simulated. Phase 2 involves registering Cargo as a business entity and authorizing strict UPI/Netbanking top-ups via Razorpay's Indian Gateway.

**MSG91 OTP Implementation:**
Replacing fake numbers with real SMS verification to prevent spam user creation.

-----
## 10\.2 Phase 3 — Scale & Real-Time Functionality 
Once stable at the district level, the platform will scale:

**Real-Time Tracking (Sockets):**
Integrating Socket.io. When a driver enters the `ENROUTE` state, their phone's GPS will emit coordinates every 5 seconds, updating a live map on the passenger's screen.

**Multi-Language Support (i18n):**
Because Cargo targets rural and semi-urban Indian demographics, forcing English UI restricts adoption. Marathi, Hindi, and local dialects will be integrated at the routing level.

**Ola/Google Maps Migration:**
Replacing the free, open-source Leaflet map (which lacks real-time traffic data) with premium enterprise map APIs to ensure ETA calculations are accurate during rush hour.

-----
## 10\.3 Long-term Vision
The long-term vision of Cargo is to evolve past an "App" and become a standard protocol for rural mobility.

**Fleet Management Systems:**
Currently, Pure Owners manage vehicles individually. Future iterations will include "Fleet Mode," allowing local businessmen to monitor 20+ vehicles simultaneously on a single analytical dashboard.

**Direct Communication Bridges:**
Once initial trust is established via Cargo's verification, we intend to allow drivers and passengers to communicate and bargain directly, reducing the platform to a mere safety and tracking layer. 

By building a neutral tool instead of a governing algorithm, Cargo aims to inject modern technology into the unorganized transport sector without stealing autonomy from the people actually doing the driving.

-----
*Chapter 10 — End*

# Chapter 11 — Conclusion
-----
## 11\.1 Summary
Cargo was conceptualized to address a clear gap in the Indian transport ecosystem: the lack of a neutral, flexible aggregator for non-metro areas where rigid, platform-dictated pricing fails. Over the course of this project, we successfully designed, modeled, and developed a platform that respects the complex, 3-sided reality of local transport.

By decoupling the "Driver" from the "Vehicle", Cargo created a native short-term rental ecosystem. By introducing a hybrid "Self Driver" role alongside Pure Drivers and Pure Owners, the software accurately maps to how businesses operate in reality. Finally, by granting pricing autonomy (hourly vs per-km) directly to the operators and implementing a guaranteed "Pickup Charge", Cargo ensures a fair market environment.

-----
## 11\.2 Learning Outcomes
Building Cargo provided immense exposure to professional, full-stack software development:
- **Architecture:** Transitioning from four separate user interfaces to a single unified Next.js dashboard significantly improved understanding of React Context and modular component states.
- **Database Design:** Structuring a 9-schema NoSQL MongoDB database taught vital lessons regarding nested sub-documents (like `driverInfo`), referencing ObjectIds, and managing state across collections efficiently.
- **Backend APIs:** Writing complex `$near` geospatial aggregation queries provided insight into how major tech companies handle location services.
- **Security:** Implementing HTTP-only JWTs, password hashing, and explicit rate-limiting offered practical experience with essential web security concepts that theoretical studies often miss.

-----
## 11\.3 Project Impact
While currently a diploma project, Cargo constitutes a fully architected business model. It proves that technology does not need to centralize power to be effective. The systems developed—the wallet escrow, the find-ride matching algorithm, and the anti-spam metrics—are robust enough to serve as the foundation for a real startup aimed at organizing India's rural transport sector.

-----
*Chapter 11 — End*

## Bibliography / References

|**#**|**Source**|**URL / Details**|
| :-: | :-: | :-: |
|1|Next.js 15 App Router Documentation|https://nextjs.org/docs|
|2|MongoDB Atlas & Geospatial Queries|https://www.mongodb.com/docs|
|3|Mongoose ODM Validation Guidelines|https://mongoosejs.com/docs|
|4|Tailwind CSS Utility Classes|https://tailwindcss.com/docs|
|5|JWT (JSON Web Tokens) RFC 7519|https://jwt.io/introduction|
|6|Leaflet.js Open-Source Mapping|https://leafletjs.com|
|7|Ola — Zero Commission Shift|Market Research (2025 Reports)|
|8|Rapido — Tier 2 Expansion Data|Market Research|
|9|Porter — B2B Logistics Flow|https://porter.in|
|10|Motor Vehicles Act 2019 — Aggregator Rules|Ministry of Road Transport|

-----
*Cargo — Project Thesis | Sushganga Polytechnic, Wani | Session 2024–2025*
