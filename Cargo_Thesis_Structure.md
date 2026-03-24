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
|**2**|Objectives & Target Users|<p>2\.1  Primary Objectives</p><p>2\.2  Target User Groups</p><p>2\.3  Expected Outcomes</p>|5|
|**3**|Literature Survey|<p>3\.1  Existing Systems Review</p><p>3\.2  Comparative Analysis</p><p>3\.3  Research Gap Identified</p>|8|
|**4**|System Design & Architecture|<p>4\.1  System Architecture Overview</p><p>4\.2  Role-Based Access Control (RBAC)</p><p>4\.3  Component Architecture</p><p>4\.4  Database Design (MongoDB Schemas)</p><p>4\.5  API Architecture</p><p>4\.6  Authentication Flow</p><p>4\.7  ER Diagram</p>|12|
|**5**|Technology Stack|<p>5\.1  Frontend Technologies</p><p>5\.2  Backend Technologies</p><p>5\.3  Database</p><p>5\.4  Dev Tools & Deployment</p><p>5\.5  Why This Stack?</p>|22|
|**6**|Implementation|<p>6\.1  Admin Panel (Complete)</p><p>6\.2  Authentication System</p><p>6\.3  User Management Module</p><p>6\.4  Booking Management Module</p><p>6\.5  Ride Booking UI</p><p>6\.6  Dashboard & Stats</p><p>6\.7  Key Code Snippets</p>|27|
|**7**|Features & Modules|<p>7\.1  Implemented Features</p><p>7\.2  Features In Development</p><p>7\.3  Planned Features</p><p>7\.4  Module Interaction Flow</p>|45|
|**8**|Testing|<p>8\.1  Testing Strategy</p><p>8\.2  Admin Panel Testing</p><p>8\.3  API Endpoint Testing</p><p>8\.4  Test Cases Table</p>|52|
|**9**|Results & Screenshots|<p>9\.1  Admin Login</p><p>9\.2  Dashboard</p><p>9\.3  User Management</p><p>9\.4  Booking Management</p><p>9\.5  Ride Booking UI</p>|57|
|**10**|Future Development|<p>10\.1  Phase 2 — Core Features</p><p>10\.2  Phase 3 — Scale & Mobile</p><p>10\.3  Long-term Vision</p>|63|
|**11**|Conclusion|<p>11\.1  Summary</p><p>11\.2  Learning Outcomes</p><p>11\.3  Project Impact</p>|66|
|**—**|Bibliography / References|Tools, Frameworks, Documentation Used|68|



**Chapter 1  Introduction**

**1.1  Project Background**

**1.2  Problem Statement**

**1.3  Proposed Solution**

**1.4  Project Scope**

**1.5  Report Organization**

*[ Chapter content will be written here ]*
# Chapter 1 — Introduction
-----
## 1\.1 Project Background
Transportation has always been an essential part of daily life. In recent years, technology has changed how people travel and move goods from one place to another. Platforms like Ola and Uber have shown that connecting passengers with drivers through a simple app can solve real problems. But these platforms are mostly focused on big cities and they work in a very controlled way — the platform decides the pricing, the driver just follows the rules, and the vehicle owner has very little say in how their asset is used.

When we started thinking about Cargo, we had a different idea. We noticed that in many areas across India, local transport is still very unorganized. Passengers don't know which vehicles are available, drivers don't have a reliable way to find customers, and vehicle owners have no system to manage their fleet. Everything depends on word of mouth or phone calls.

We also felt that existing platforms are too platform-centric. The driver has little freedom. The owner has no visibility. The passenger just hopes for the best. So we thought — what if we build something where all three parties can communicate directly and work things out on their own terms? That was the original idea behind Cargo.

-----
## 1\.2 Problem Statement
The main problems we identified are:

**Lack of reliable local transport booking:** Passengers in non-metro areas have no reliable way to book transport. They either have to call someone they know or wait on the roadside. There is no way to check vehicle availability, pricing, or driver details in advance.

**No platform for drivers and owners:** Drivers and vehicle owners have no platform to reach customers. They rely on daily luck or personal contacts to get work. There is no system to track trips, earnings, or history.

**Centralized, inflexible pricing:** Existing platforms use fixed pricing models decided by the platform itself. This does not work well across different regions of India where transport costs vary significantly based on road conditions, local economy, and fuel prices. A rate that makes sense in one area may be completely impractical in another.

**Vehicle underutilization:** Many people own vehicles but cannot drive them full time. These vehicles sit idle for most of the day generating no income. On the other side, there are people who want to earn through transport services but do not own a vehicle. There is currently no easy way for these two groups to find each other and work together.

**No unified multi-purpose transport platform:** There is no single platform that handles passenger rides, goods delivery, and vehicle rentals together under one system.

-----
## 1\.3 Proposed Solution
Cargo is a web-based transport aggregator platform that acts as a **neutral middleman** — connecting passengers, drivers, and vehicle owners and giving each of them control over their own experience.
### Key Features That Make Cargo Different
### 💡 Driver and Owner Controlled Pricing
Unlike platforms that fix rates centrally, **Cargo allows drivers and vehicle owners to set their own charges** according to their area and requirements.

This is a major advantage for rural and semi-urban regions where transport economics are very different from cities. A driver in a remote area can set rates that reflect the actual cost of operating there. This flexibility makes the platform genuinely useful across diverse geographies — something no existing major platform offers at the local level.
### 🚗 Vehicle Rental System
Cargo supports a **vehicle rental model** within the platform itself.

- If a vehicle owner has a vehicle but does not want to drive it themselves — they can **list it for rent** on the platform.
- If someone wants to earn through transport but does **not own a vehicle** — they can **rent one through the platform** and start working immediately.

This opens up earning opportunities for people on both sides and keeps vehicles from sitting idle.
### 🔄 Multi-Purpose Platform
Cargo is not limited to one type of transport. The same platform can be used for:

- **Passenger rides**
- **Goods transport**
- **Vehicle rentals**

This makes it useful to a much wider range of people — a passenger booking a ride, a small business sending goods, or an entrepreneur looking to start a transport service without owning a vehicle.
### 🤝 Communication First Vision
The original vision behind Cargo is to work as a **communication bridge**. Instead of the platform controlling every interaction, Cargo connects the parties and lets them coordinate directly.

In a future phase, direct messaging between passengers, drivers, and owners will be added to fully realize this vision.

-----
## 1\.4 Project Scope
### ✅ Currently Implemented

|**Module**|**Status**|**Details**|
| :-: | :-: | :-: |
|Admin Panel|Complete|Login, dashboard, user management, booking management|
|Authentication System|Complete|JWT-based, HTTP-only cookies, secure login/logout|
|Role-Based Access|Complete|Passenger, Driver, Owner, Admin — 4 distinct roles|
|Booking UI|Complete (Frontend)|Ride booking interface, location selection|
|Database Design|Complete|9 schemas — Users, Vehicles, Bookings, Wallets, Trips, Reviews, Notifications, PlannedTrip|
### 🚧 Planned for Next Phase
- Real-time ride tracking using GPS
- Payment gateway integration (Razorpay / Stripe)
- Vehicle rental workflow (full implementation)
- Direct messaging between users
- Mobile application (React Native)
-----
## 1\.5 Report Organization
This report is organized into eleven chapters:

|**Chapter**|**Title**|**Description**|
| :-: | :-: | :-: |
|1|Introduction|Background, problem, solution, scope|
|2|Objectives & Target Users|What Cargo aims to achieve and who it serves|
|3|Literature Survey|Existing systems and how Cargo is different|
|4|System Design & Architecture|Database design, RBAC, API architecture|
|5|Technology Stack|Technologies used and reason behind each choice|
|6|Implementation|Actual code and working features|
|7|Features & Modules|Complete and planned feature list|
|8|Testing|Test cases and results|
|9|Results & Screenshots|Working system screenshots|
|10|Future Development|Next phases and long-term vision|
|11|Conclusion|Summary and learning outcomes|

-----
*Chapter 1 — End*


#
**Chapter 2  Objectives & Target Users**

**2.1  Primary Objectives**

**2.2  Target User Groups**

**2.3  Expected Outcomes**

*[ Chapter content will be written here ]*
# Chapter 2 — Objectives & Target Users
-----
## 2\.1 Primary Objectives
The main goal of Cargo is to create a transport platform that actually works for everyone involved — not just the passenger, but also the driver and the vehicle owner. Most existing platforms are built around the passenger experience and treat drivers as resources. Cargo is built around the idea that all three parties matter equally.

These are the core objectives we set for this project:

**Create a unified transport platform:** Build one platform that handles passenger rides, goods transport, and vehicle rentals — so users don't need different apps for different needs.

**Give pricing control to drivers and owners:** Let drivers and vehicle owners set their own rates based on their area, vehicle type, and operating costs. The platform should never force a fixed rate on them.

**Enable vehicle rental within the platform:** Allow vehicle owners to rent out their vehicles through the platform, and allow aspiring drivers to rent vehicles and start earning — without needing to own anything.

**Make transport accessible in non-metro areas:** Build something that works not just in big cities but anywhere — a platform flexible enough to adapt to local conditions, local pricing, and local needs.

**Act as a communication bridge, not a controller:** The platform's job is to connect people and let them work things out. Cargo should stay in the background as a facilitator, not get in the way of how people want to work.

**Build a secure and scalable system:** Make sure the platform is secure from the start — proper authentication, role-based access, and a database structure that can grow as the platform expands.

-----
## 2\.2 Target Users
Cargo is designed for three types of users. Each has their own dashboard, their own set of features, and their own reason for using the platform.

-----
### 👤 Passengers
**Who they are:** Anyone who needs to travel or send goods from one place to another and wants a reliable, transparent way to book transport.

**What they can do on Cargo:**

- Search for available transport based on location
- View vehicle details, driver information, and pricing before booking
- Book instant or scheduled rides
- Track their booking status
- View their ride history

**Why Cargo works for them:** They get transparency — they can see who is driving, what vehicle it is, and what the cost will be before they confirm. This is something that is completely missing in unorganized local transport today.

-----
### 🚗 Drivers
**Who they are:** People who own or have access to a vehicle and want to earn by providing transport services.

**What they can do on Cargo:**

- Register and create a verified driver profile
- Set their own availability and working hours
- **Set their own rates** according to their area and vehicle
- Receive and manage booking requests
- Track their earnings and trip history

**Why Cargo works for them:** They are not just a resource on this platform — they have real control. They decide their price, they decide when they work, and they get a direct connection to passengers without depending on middlemen or phone calls.

**Key advantage:** A driver operating in a rural or hilly area can set rates that reflect the actual cost of running their vehicle in that area. No platform-imposed pricing that doesn't match ground reality.

-----
### 🏠 Vehicle Owners
**Who they are:** People who own one or more vehicles but may not want to drive them personally. They want their vehicles to earn money even when they are not using them.

**What they can do on Cargo:**

- List their vehicles on the platform with full details
- Assign a driver to their vehicle
- **Rent out their vehicle** to a driver through the platform
- Monitor how their vehicle is being used
- Track revenue generated by their vehicle

**Why Cargo works for them:** Their vehicle does not have to sit idle. They can either assign a trusted driver or list it for rent on the platform — either way, their asset keeps earning.

**Key advantage:** An owner who has a vehicle but no time to drive can still earn from it by renting it out to a driver through Cargo. This is a completely new earning model that existing platforms do not offer.

-----
### 🔄 The Rental Connection — Owners + Drivers Together
One of the most unique aspects of Cargo is how it connects owners and drivers through the rental system:

Vehicle Owner                    Driver (no vehicle)

─────────────                    ───────────────────

Has a vehicle          →→→       Wants to earn

Does not want to drive           Does not own a vehicle

Lists vehicle for rent  ←→←→    Rents the vehicle

`        `│                                │

`        `└──────── Both earn ─────────────┘

`                  `through Cargo

This model creates a small ecosystem within the platform — owners earn rental income, drivers earn from rides, and passengers get more vehicles available to them.

-----
## 2\.3 Who Benefits — At a Glance

|**User**|**Main Benefit**|**Unique to Cargo**|
| :-: | :-: | :-: |
|Passenger|Reliable booking, transparent pricing|See real rates set by local drivers|
|Driver|Earn on own terms, set own rates|No platform-forced pricing|
|Vehicle Owner|Vehicle earns even without driving|Rent out vehicle through platform|

-----
## 2\.4 Expected Outcomes
By achieving these objectives, Cargo aims to:

- **Reduce transport uncertainty** for passengers in areas where organized transport doesn't exist yet
- **Increase earnings** for drivers and vehicle owners by giving them more control and more visibility
- **Create new earning opportunities** for people who want to work in transport but don't own a vehicle
- **Build a foundation** that can scale from a small area to an entire region without changing how the platform works — because the flexible pricing model adapts automatically to wherever it is deployed
-----
*Chapter 2 — End*
\*\



**Chapter 3  Literature Survey**

**3.1  Existing Systems Review (Ola, Uber, Porter comparison)**

**3.2  Comparative Analysis Table**

**3.3  Research Gap Identified**

*[ Chapter content will be written here ]*

\

# Chapter 3 — Literature Survey
-----
## 3\.1 Introduction
Before building Cargo, we studied the existing transport platforms in India to understand what is already available, what works well, and what gaps still exist. This chapter covers four major platforms — Ola, Uber, Rapido, and Porter — and compares their features with what Cargo is trying to do.

The goal of this review is not to criticize existing platforms. All of them have genuinely solved real problems at scale. The goal is to understand the landscape clearly so that Cargo's approach and the problems it addresses are properly justified.

-----
## 3\.2 Existing Systems Review
-----
### 3\.2.1 Ola
**Founded:** 2010 | **Type:** Ride-hailing (cabs, autos, bikes) | **Coverage:** 110+ cities in India

Ola is one of India's largest ride-hailing platforms. It connects passengers with cab, auto, and bike drivers through a mobile app. Passengers can book rides instantly or in advance, track their driver in real time, and pay through the app or cash.

**What Ola does well:**

- Large driver network across major cities
- Multiple vehicle categories (auto, bike, mini, sedan, prime)
- Real-time GPS tracking
- In-app payment with Ola Money wallet
- Surge pricing during peak hours to balance supply and demand
- SOS safety features for passengers

**Recent developments (2025):** Ola launched a zero-commission model across India in 2025, allowing drivers to pay a flat subscription fee (around ₹67/day) and keep 100% of their fare earnings. This was a major shift from the earlier model where Ola charged 20–40% commission per ride. This change was driven largely by driver protests across major cities about unfair earnings.

**Limitations relevant to our research:**

- Primarily focused on metro and Tier-1 cities
- Even with the zero-commission model, the pricing structure is still largely algorithm-driven — drivers cannot set their own per-km rates independently
- No vehicle rental model — owners cannot list their vehicles for rent to other drivers on the platform
- No goods transport service
- The platform still decides base fares; government-approved rates apply in many states
-----
### 3\.2.2 Uber
**Founded:** 2009 (India operations: 2013) | **Type:** Ride-hailing | **Coverage:** Major Indian cities

Uber operates similarly to Ola in India, offering cab bookings through a mobile app. In February 2025, Uber also shifted to a subscription-based zero-commission model for auto drivers in India, rebranding itself as a SaaS platform — meaning drivers pay a subscription and keep full fares.

**What Uber does well:**

- Strong presence in metro cities
- Reliable driver background verification
- In-app safety features (share trip, emergency SOS)
- Upfront fare estimates before booking
- Scheduled ride booking

**Limitations relevant to our research:**

- Similar to Ola — metro-focused, algorithm-controlled pricing
- Drivers cannot set their own rates; Uber's dynamic pricing model controls fares
- No vehicle rental feature
- No goods transport
- Not built for non-metro or rural areas
-----
### 3\.2.3 Rapido
**Founded:** 2015 | **Type:** Bike taxi, auto, cab, logistics | **Coverage:** 100+ cities

Rapido started as a bike taxi platform and has grown significantly. As of 2025, it has over 100 million app downloads and completes over 33 lakh rides daily. In February 2025, Rapido shifted fully to a SaaS model — drivers pay a subscription fee upfront and keep 100% of their fares.

Rapido is also notable for expanding into Tier-2 and Tier-3 cities, where over 35% of its rides now come from. It has partnerships with metro stations for first and last-mile connectivity, and also offers a B2B logistics service for businesses.

**What Rapido does well:**

- Very affordable fares (₹30–₹60 for short rides)
- Strong presence in smaller cities
- Subscription model gives drivers better earnings predictability
- Multi-service: bike taxi, auto, cab, and delivery
- Available in 500+ cities

**Limitations relevant to our research:**

- Bike taxi service faces legal issues in several states — not a stable option everywhere
- Pricing is still platform-managed; individual drivers cannot set custom rates
- No vehicle rental model for owners
- Primarily focused on short intracity trips
- No unified passenger + goods + rental model under one platform
-----
### 3\.2.4 Porter
**Founded:** 2014 | **Type:** Goods transport (intracity and intercity) | **Coverage:** 22+ cities

Porter is India's leading goods transport aggregator. It connects businesses and individuals who need to transport goods with drivers who own trucks, tempos, or two-wheelers. In 10 years of operation, it has served over 1.5 crore customers and has 7.5 lakh driver partners.

**What Porter does well:**

- Wide range of vehicles: bikes, 3-wheelers, Tata Ace, pickup trucks, 14ft trucks
- Transparent pricing based on distance and vehicle type
- Real-time tracking for deliveries
- Porter Enterprise for B2B logistics
- Packers and Movers service
- Daily payouts for driver partners
- Porter Partner app allows vehicle owners to attach their vehicles to the platform

**Limitations relevant to our research:**

- Only goods transport — no passenger rides
- Operates mainly in large cities (Mumbai, Delhi, Bengaluru, Hyderabad, etc.)
- Pricing is set by the platform — drivers cannot set custom rates
- No vehicle rental model — cannot rent a vehicle through the platform to start earning
- No combined passenger + goods platform
-----
## 3\.3 Comparative Analysis
The table below compares the four platforms with Cargo based on key features:

|**Feature**|**Ola**|**Uber**|**Rapido**|**Porter**|**Cargo**|
| :-: | :-: | :-: | :-: | :-: | :-: |
|Passenger rides|✅|✅|✅|❌|✅|
|Goods transport|❌|❌|Partial|✅|✅ (Planned)|
|Driver sets own rates|❌|❌|❌|❌|**✅**|
|Vehicle rental model|❌|❌|❌|❌|**✅**|
|Earn without owning vehicle|❌|❌|❌|❌|**✅**|
|Rural / non-metro focus|Limited|Limited|Growing|Limited|**✅**|
|Zero commission option|✅ (2025)|✅ (2025)|✅ (2025)|❌|**✅**|
|Multi-role platform (passenger + driver + owner)|Limited|Limited|Limited|Limited|**✅**|
|Web-based platform|❌ (app only)|❌ (app only)|❌ (app only)|❌ (app only)|**✅**|
|Direct communication between users|❌|❌|❌|Limited|**✅ (Planned)**|

**Note:** Features marked as Planned for Cargo are part of the next development phase and are not yet implemented.

-----
## 3\.4 Research Gap Identified
After reviewing all four platforms, the following gaps are clearly visible:

**1. No platform allows drivers or owners to set their own rates**

All four platforms — Ola, Uber, Rapido, and Porter — control pricing either through algorithms, government-approved base fares, or fixed platform rates. Even after the 2025 zero-commission model shift, the base per-km rate is still not in the driver's hands. This is a real problem in areas outside metro cities where local conditions affect operating costs differently.

**2. No vehicle rental ecosystem exists within any transport platform**

None of the four platforms allow a vehicle owner to list their vehicle for rent to another driver, or allow a driver without a vehicle to rent one and start earning. These are completely separate transactions that happen outside any platform today. Cargo aims to bring this inside the platform.

**3. No unified platform for both passengers and goods transport**

Ola, Uber, and Rapido focus entirely on passengers. Porter focuses entirely on goods. No platform currently combines both under one system with a shared driver and vehicle pool.

**4. All major platforms are app-only and metro-focused**

Every platform listed above requires a mobile app. None of them are web-based, which limits accessibility. Additionally, despite Rapido's expansion into smaller cities, the core product design of all these platforms is still built for dense urban environments with high ride volume.

**5. Communication between users is controlled by the platform**

On all existing platforms, the only contact between a passenger and driver is a masked phone call arranged by the platform. There is no direct communication, no way to negotiate, and no way to build any kind of working relationship. Cargo's long-term vision is to change this.

-----
## 3\.5 Summary
Each platform reviewed in this chapter has solved a significant problem and serves millions of users. Ola and Uber have made urban cab booking reliable. Rapido has made short-distance travel affordable. Porter has organized goods transport for businesses and individuals.

However, none of them address the combination of problems that Cargo targets — custom pricing by drivers, vehicle rental within the platform, a unified passenger and goods system, and a communication-first approach to transport. These gaps form the foundation and justification for building Cargo.

-----
*Chapter 3 — End*



**Chapter 4  System Design & Architecture**

**4.1  System Architecture Overview**

**4.2  Role-Based Access Control (RBAC)**

**4.3  Component Architecture**

**4.4  Database Design — MongoDB Schemas**

`      `User Model | Vehicle Model | Booking Model | Wallet | Trip | Review | Notification

**4.5  API Architecture & Endpoints**

**4.6  JWT Authentication Flow**

**4.7  ER Diagram**

*[ Chapter content will be written here ]*
#
# Chapter 4 — System Design & Architecture
**Project:** Cargo — Smart Transport Aggregator Platform **Version:** 1.0 | March 2026 **Tech Stack:** Next.js 15, MongoDB, TypeScript, Tailwind CSS, Shadcn/ui

-----
**Implementation Status Key used throughout this chapter:** ✅ **Implemented** — Built and working 🔄 **In Progress** — Partially built 📋 **Planned** — Designed but not yet built

-----
## 4\.1 System Architecture Overview
Cargo is a web-based, 3-sided transport aggregator platform that connects Passengers, Drivers, and Vehicle Owners through a single application. The platform is built using Next.js 15 which handles both the frontend and backend in one codebase. This approach was chosen to keep the project simple and deployable without managing two separate servers.

The architecture has three main layers — a client layer that users interact with, an application layer that handles all business logic, and a data layer that stores everything in MongoDB.
### 4\.1.1 High-Level Architecture
┌──────────────────────────────────────────────────────────────────┐

│                    CLIENT LAYER (Browser / PWA)                  │

│           Next.js 15 Frontend — Tailwind CSS + Shadcn/ui         │

│                                                                  │

│  [Passenger UI]  [Driver UI]  [Owner UI]  [Self Driver UI]       │

│                       [Admin Panel]                              │

└─────────────────────────┬────────────────────────────────────────┘

`                          `│  HTTP Requests (JWT in cookies)

`                          `│

┌─────────────────────────▼────────────────────────────────────────┐

│                   APPLICATION LAYER                              │

│             Next.js API Routes — app/api/...                     │

│                                                                  │

│   middleware.ts → JWT verify → Role check → Route protection     │

│                                                                  │

│   /api/auth/       /api/bookings/     /api/find-ride/            │

│   /api/profile/    /api/vehicles/     /api/drivers/              │

│   /api/admin/      /api/users/        /api/map/                  │

└─────────────────────────┬────────────────────────────────────────┘

`                          `│

┌─────────────────────────▼────────────────────────────────────────┐

│                      DATA LAYER                                  │

│                 MongoDB Atlas (Cloud)                            │

│              Mongoose ODM — lib/db.ts                            │

│                                                                  │

│   Users | Vehicles | Bookings | BookingRequests                  │

│   Trips | Wallets | Reviews | Notifications | PlannedTrips       │

└─────────────────────────┬────────────────────────────────────────┘

`                          `│

┌─────────────────────────▼────────────────────────────────────────┐

│                  EXTERNAL SERVICES                               │

│                                                                  │

│   Maps:     Leaflet + OpenStreetMap (routing + location)         │

│   Storage:  Cloudinary (profile photos, documents)              │

│   Payments: Razorpay / Cashfree — escrow model    📋 Planned     │

│   Notif:    Push + SMS via MSG91                  📋 Planned     │

│   Real-time: Socket.io — driver live tracking     📋 Planned     │

└──────────────────────────────────────────────────────────────────┘
### 4\.1.2 Why This Architecture?
Cargo is a college diploma project that is also being built as a real product. Because of this, the architecture needed to be simple enough to build with a small team while still being correct and scalable.

|**Decision**|**Choice Made**|**Reason**|
| :-: | :-: | :-: |
|Full-stack framework|Next.js 15 (App Router)|Frontend + Backend in one project — easier to deploy and manage|
|Database|MongoDB + Mongoose|Flexible schema — 3 different user role structures fit well in document model|
|Auth method|JWT stored in HTTP-only cookies|Secure, stateless — works well with Next.js middleware|
|Image/doc storage|Cloudinary|Free tier available, easy upload integration with Multer|
|Maps|Leaflet + OpenStreetMap|Completely free — no billing setup needed for development and testing|
|Styling|Tailwind CSS + Shadcn/ui|Fast UI development with consistent component library|
|Deployment|Vercel + MongoDB Atlas|Already live — Vercel is optimized for Next.js, Atlas provides free cloud DB|
### 4\.1.3 Project Folder Structure
The project follows Next.js App Router conventions. Each folder has a clear responsibility.

cargo/

├── app/                    # Next.js App Router

│   ├── api/                # All backend API routes

│   │   ├── auth/           # Login, signup, logout

│   │   ├── bookings/       # Booking creation, confirmation

│   │   ├── find-ride/      # Pair generation + search

│   │   ├── drivers/        # Driver availability

│   │   ├── vehicles/       # Vehicle listing

│   │   ├── profile/        # User profile management

│   │   ├── users/          # User data

│   │   ├── map/            # Map-related APIs

│   │   └── admin/          # Admin-only APIs

│   ├── dashboard/          # Role-based dashboards

│   │   ├── passenger/      # Passenger dashboard

│   │   ├── driver/         # Driver dashboard

│   │   ├── owner/          # Owner dashboard

│   │   └── admin/          # Admin dashboard

│   ├── find-ride/          # Find ride page

│   ├── login/              # Login page

│   ├── signup/             # Signup page

│   └── profile/            # Profile page

│

├── components/             # Reusable React components

│   ├── ui/                 # Shadcn/ui base components

│   ├── auth/               # Login, Signup forms

│   ├── admin/              # Admin tables, filters

│   ├── find-ride/          # Find ride UI (25 components)

│   └── profile/            # Profile sections

│

├── models/                 # MongoDB schemas (Mongoose)

│   ├── User.ts             # All roles in one collection

│   ├── Vehicle.ts          # Vehicle listings

│   ├── Booking.ts          # Booking records

│   ├── BookingRequest.ts   # Driver/Owner request tracking

│   ├── Trip.ts             # Active trip + live tracking

│   ├── Wallet.ts           # Payments + transactions

│   ├── Review.ts           # Ratings and reviews

│   ├── Notification.ts     # In-app notifications

│   └── PlannedTrip.ts      # Scheduled trips

│

├── lib/                    # Core utilities

│   ├── db.ts               # MongoDB connection (singleton)

│   ├── auth.ts             # JWT verify helpers

│   └── utils.ts            # General helpers

│

├── context/                # React Context providers

│   ├── AuthContext.tsx      # Auth state across app

│   └── FindRideContext.tsx  # Find ride state

│

├── hooks/                  # Custom React hooks

│   ├── useAuth.tsx          # Auth hook

│   └── useProfile.ts        # Profile hook

│

├── types/                  # TypeScript type definitions

├── middleware.ts            # Route protection (JWT + RBAC)

└── scripts/                # DB seed and utility scripts
### 4\.1.4 Request Flow — How a Page Load Works
Every protected page request in Cargo goes through this flow:

User visits /dashboard/driver

`          `↓

middleware.ts runs first

`  `→ Checks JWT cookie

`  `→ Verifies token using jose library

`  `→ Checks if user has required role

`  `→ If invalid → redirect to /login

`  `→ If valid → allow request

`          `↓

Page component loads

`  `→ Calls API route (e.g. /api/profile)

`  `→ API route calls connectToDB() from lib/db.ts

`  `→ MongoDB Atlas connection reused (singleton cache)

`  `→ Data returned as JSON

`          `↓

UI renders with data
### 4\.1.5 Deployment

|**Layer**|**Platform**|**Status**|
| :-: | :-: | :-: |
|Frontend + Backend (Next.js)|Vercel|✅ Live|
|Database|MongoDB Atlas (Cloud)|✅ Live|
|File Storage|Cloudinary|✅ Live|
|Maps|Leaflet + OpenStreetMap|✅ Live|
|Payments|Razorpay / Cashfree|📋 Planned|
|Real-time (Socket.io)|To be decided|📋 Planned|

-----
## 4\.2 Role-Based Access Control (RBAC)
Cargo has a role-based access control system where different users see different parts of the platform based on their assigned roles. The interesting design decision in Cargo is that the database stores 3 roles, but the UI shows 4 user types.
### 4\.2.1 Role Architecture
**Database stores 3 roles. UI displays 4 tags.**

This separation was done intentionally. "Self Driver" is not a new role — it is a combination of Driver + Owner roles with selfDriven: true flag on the vehicle. The UI simply shows a different label when both roles are present.

|**DB Roles Array**|**UI Display Tag**|**Description**|
| :-: | :-: | :-: |
|["passenger"]|🟢 Passenger|Default user — can only book rides|
|["passenger", "driver"]|🔵 Driver|Has license, no vehicle — drives rented vehicles|
|["passenger", "owner"]|🟠 Owner|Has vehicle, does not drive — rents vehicle out|
|["passenger", "driver", "owner"]|🟣 Self Driver|Has vehicle + license — drives own vehicle|
|["admin"]|Admin|Internal only — platform management|
### 4\.2.2 User Status Design
Every user has a top-level status field. This is separate from role-specific availability.

|**Status**|**Who Can Have It**|**Meaning**|
| :-: | :-: | :-: |
|OFFLINE|Driver, Owner, Self Driver|Invisible to system — no bookings|
|ONLINE|Driver, Owner, Self Driver|Available for bookings|
|ON\_TRIP|Driver, Self Driver only|Currently on a trip — system sets automatically|

**Driver Status Rules:**

OFFLINE → ONLINE: Driver manually toggles (one button)

ONLINE → ON\_TRIP: System sets automatically when trip starts

ON\_TRIP → ONLINE: System sets automatically when trip ends

ON\_TRIP → OFFLINE: ❌ Blocked — cannot go offline during a trip

Effect on licenses:

`  `User OFFLINE → ALL licenses invisible (regardless of isActive)

`  `User ONLINE  → Active licenses visible for matching

`  `User ON\_TRIP → ALL licenses unavailable (one person, one job)

**Owner Status Rules:**

Owner has NO ON\_TRIP status — Owner does not drive

OFFLINE → ONLINE: Owner manually toggles

ONLINE: Each vehicle has its own independent status

`  `Vehicle 1 → ON\_TRIP (with Driver A)

`  `Vehicle 2 → AVAILABLE

`  `Vehicle 3 → OFFLINE (manually disabled)

If Owner → OFFLINE: All vehicles OFFLINE (master override)

**Self Driver Status Rules:**

Same as Driver rules

User.status and Vehicle.status stay in sync:

`  `User ONLINE  → Vehicle AVAILABLE

`  `User ON\_TRIP → Vehicle ON\_TRIP

`  `User OFFLINE → Vehicle OFFLINE
### 4\.2.3 Role Assignment Rules
Registration:

`  `Every new user → roles: ["passenger"] automatically

Becoming a Driver:

`  `User fills Driver form (license details)

`  `→ roles updated to: ["passenger", "driver"]

Becoming an Owner:

`  `User fills Owner form (vehicle details)

`  `Toggle "Self Driver" OFF → roles: ["passenger", "owner"]

`  `Toggle "Self Driver" ON  → Driver form opens below Owner form

`                           `→ roles: ["passenger", "driver", "owner"]

`                           `→ selfDriven: true on vehicle

`                           `→ UI tag: "Self Driver"
### 4\.2.4 Permission Table

|**Feature**|**Passenger**|**Driver**|**Owner**|**Self Driver**|**Admin**|
| :-: | :-: | :-: | :-: | :-: | :-: |
|Book a ride|✅|✅|✅|✅|—|
|Accept booking requests|❌|✅|✅|✅|—|
|Instant booking (receive)|❌|❌|❌|✅|—|
|Prebooking (receive)|❌|✅|✅|✅|—|
|List a vehicle|❌|❌|✅|✅|—|
|Set driver availability|❌|✅|❌|✅|—|
|View own earnings|❌|✅|✅|✅|—|
|Rate after trip|✅|✅|✅|✅|—|
|Manage all users|❌|❌|❌|❌|✅|
|View all bookings|❌|❌|❌|❌|✅|
|Issue warnings/bans|❌|❌|❌|❌|✅|
### 4\.2.5 RBAC Implementation
Roles are stored as an array in the User document in MongoDB. The JWT token issued at login contains the roles array. Every protected API route and page checks this array.

**JWT Payload structure:**

{

`  `id: "mongo\_user\_id",

`  `roles: ["passenger", "driver"],

`  `iat: 1711234567,

`  `exp: 1711320967

}

**middleware.ts — Route Protection:** ✅ Implemented

// middleware.ts checks JWT on every protected route

const { payload } = await jwtVerify(token, secret);

// Admin route check

if (pathname.startsWith("/dashboard/admin")) {

`  `const roles = payload?.roles as string[];

`  `if (!roleList.includes("admin")) {

`    `return NextResponse.redirect(new URL("/dashboard/passenger", req.url));

`  `}

}

**Protected Routes:**

|**Route Pattern**|**Who Can Access**|
| :-: | :-: |
|/dashboard/passenger/\*|Any logged-in user|
|/dashboard/driver/\*|Users with "driver" role|
|/dashboard/owner/\*|Users with "owner" role|
|/dashboard/admin/\*|Users with "admin" role only|
|/profile/\*|Any logged-in user|
|/api/admin/\*|Admin only|

**Implementation Status:**

- ✅ Admin RBAC — fully implemented (middleware + API route guards)
- ✅ JWT auth with role payload — implemented
- 📋 Driver/Owner dashboard route guards — planned (pattern established)

### 4.2.6 Tag System & Role Display
The platform uses a smart tag system to display user roles clearly based on their actual capabilities and vehicle configuration.

**Dynamic Tag Computation:**
Tags are computed dynamically based on roles array + vehicle selfDriven status, not just the roles array alone. This provides more accurate representation of what the user can actually do.

**Tag Display Logic:**
- **Self Driver tag:** Replaces the confusing "Driver + Owner" combination when user has both roles AND all vehicles are selfDriven: true
- **Self Driver + Owner tag:** Shows when user has mixed vehicles — some for personal use, some for renting out
- **Number badges:** Show at a glance how many licenses/vehicles a user has, making the platform more informative

**Self Driver Vehicle Reservation:**
Business rule: selfDriven vehicles are exclusively reserved for their owner. This prevents booking conflicts and ensures vehicle availability for the owner. Enforced at both database level (assignedDriver = owner) and API level.

-----

## 4\.3 Database Design
Cargo uses MongoDB as its database with Mongoose as the ODM (Object Document Mapper). All collections are stored in MongoDB Atlas cloud. The database is designed to support the 3-sided marketplace with flexible role-based data in a single User collection.
### 4\.3.1 Collections Overview

|**Collection**|**Purpose**|**Status**|
| :-: | :-: | :-: |
|users|All users — all roles in one collection|✅|
|vehicles|Vehicles listed by Owners/Self Drivers|✅|
|bookings|All booking records|✅|
|bookingrequests|Individual requests sent to Driver+Owner pairs|✅|
|trips|Active trip data + GPS tracking|✅|
|wallets|Payment balances + transaction history|✅|
|reviews|Ratings and reviews after trips|✅|
|notifications|In-app notification log|✅|
|plannedtrips|Shared/planned trips — out of current scope|⚠️|
### 4\.3.2 Collection Relationships
User (passenger) ──────── creates ──────────► Booking

User (driver)    ──────── receives ──────────► BookingRequest

User (owner)     ──────── owns ──────────────► Vehicle

Vehicle          ──────── used in ───────────► Booking

Booking          ──────── generates ─────────► BookingRequest (multiple)

Booking          ──────── becomes ───────────► Trip (one-to-one)

Booking          ──────── has ───────────────► Review (multiple)

User             ──────── has ───────────────► Wallet (one-to-one)

User             ──────── receives ──────────► Notification (multiple)
### 4\.3.3 User Schema
The User collection stores all role types in a single collection. Role-specific data is stored in nested subdocuments (driverInfo, ownerInfo) that are only populated when that role is active.

// Key design decisions:

// 1. roles[] array — supports multiple roles per user

// 2. driverInfo.licenses[] — supports multiple license types per driver

// 3. currentLocation as GeoJSON Point — enables 2dsphere geospatial queries

// 4. permanentAddress — used for prebooking distance calculation

const userSchema = new Schema({

`  `// Core (all users)

`  `name, email, phone, password (hashed), profileImage, age, gender

`  `roles: ["passenger" | "driver" | "owner" | "admin"]

`  `isActive: Boolean

`  `// Location

`  `permanentAddress: { addressLine1, village, district, state, pincode }

`  `currentLocation: { type: "Point", coordinates: [lng, lat] }  // GeoJSON

`  `// Driver subdocument (only if roles includes "driver")

`  `// Top-level status (applies to all roles)

`  `status: "OFFLINE" | "ONLINE" | "ON\_TRIP"

`  `// OFFLINE → invisible to system

`  `// ONLINE  → available for bookings

`  `// ON\_TRIP → system sets automatically, cannot go OFFLINE manually

`  `driverInfo: {

`    `licenses: [{

`      `licenseType: "MCG" | "LMV" | "HGV" | ...  // Indian license categories

`      `licenseNumber, licenseImage (Cloudinary URL)

`      `vehicleCategory: "bike" | "auto" | "car" | "bus" | "truck"

`      `hourlyRate: Number    // driver sets own rate per license

`      `isActive: Boolean     // permanent disable only (e.g. license expired)

`      `// Note: No status here — Driver is one person, one job at a time

`      `// User.status controls all licenses together

`    `}]

`    `linkedVehicleId         // for Self Driver — links to their vehicle

`    `rating, totalTrips

`  `}

`  `// Owner subdocument (only if roles includes "owner")

`  `ownerInfo: {

`    `vehicles: [ObjectId]    // array of vehicle IDs

`  `}

`  `wallet: ObjectId          // reference to Wallet document

})

// Indexes:

userSchema.index({ currentLocation: "2dsphere" })  // for Instant booking search

**License → Vehicle Category Mapping** (defined in LICENSE\_VEHICLE\_MAP):

|**License Type**|**Vehicle Category**|
| :-: | :-: |
|MCWOG, MCG|bike|
|3W-NT, 3W-T|auto|
|LMV-NT, LMV|car|
|HMV, HGV|truck|
|HPMV|bus|
### 4\.3.4 Vehicle Schema
const vehicleSchema = new Schema({

`  `owner: ObjectId           // Owner user reference

`  `assignedDriver: ObjectId  // current Driver (for Self Driver = same as owner)

`  `selfDriven: Boolean       // true = Self Driver, false = Pure Owner

`  `make, model, year, color, plateNumber

`  `vehicleType: "bike" | "auto" | "car" | "bus" | "truck"

`  `requiredLicense           // what license type Driver needs for this vehicle

`  `seatingCapacity: Number

`  `rcDocument, insurance     // Cloudinary URLs

`  `perKmRate: Number         // Owner sets vehicle rate

`  `status: "OFFLINE" | "AVAILABLE" | "ON\_TRIP"

`  `// Independent per vehicle — Owner can have multiple vehicles with different statuses

`  `// If Owner User.status = OFFLINE → all vehicles OFFLINE (override)

`  `isAvailable: Boolean

`  `currentLocation: GeoJSON  // for Instant booking

})

// Indexes:

vehicleSchema.index({ currentLocation: "2dsphere" })

vehicleSchema.index({ vehicleType: 1, isAvailable: 1 })

vehicleSchema.index({ requiredLicense: 1, isAvailable: 1 })
### 4\.3.5 Booking Schema
Booking is the central document. It is created when a Passenger initiates a booking and tracks the entire lifecycle from search to completion.

const bookingSchema = new Schema({

`  `passenger, driver, owner, vehicle  // User/Vehicle references

`  `bookingType: "INSTANT" | "SCHEDULED"

`  `status: "REQUESTED" | "ACCEPTED" | "ENROUTE" | "STARTED" 

`        `| "COMPLETED" | "CANCELLED"

`  `pickup: { address, coordinates: { lat, lng } }

`  `dropoff: { address, coordinates: { lat, lng } }

`  `scheduledDateTime          // for SCHEDULED bookings

`  `passengers: Number

`  `fare: {

`    `driverHourlyRate         // snapshot at booking time

`    `vehiclePerKmRate         // snapshot at booking time

`    `estimatedDuration        // hours (A→B)

`    `estimatedDistance        // km (A→B only)

`    `estimatedFare            // total estimated amount

`    `finalFare                // calculated at trip end (actual)

`    `platformFee              // Rs.1/km × A→B km

`    `driverPayout             // hourly rate portion

`    `ownerPayout              // per km rate portion

`    `isComboTrip: Boolean     // true for Self Driver

`    `// Pickup charge — pre-calculated at booking confirmation

`    `// Used ONLY for cancellation after payment lock

`    `pickupCharge: {

`      `totalAmount            // total pickup charge in Rs.

`      `pickupDistanceKm       // total km (C→D + D→A or C→A)

`      `driverShare            // 60% of totalAmount → Driver

`      `ownerShare             // 40% of totalAmount → Owner

`                             `// Self Driver: ownerShare = 0, driverShare = 100%

`    `}

`  `}

`  `payment: {

`    `method: "WALLET" | "CASH"

`    `status: "PENDING" | "PAID" | "FAILED" | "REFUNDED"

`    `amount

`  `}

`  `tripData: {

`    `startTime, endTime

`    `actualDistance, actualDuration

`    `route: [{ lat, lng, timestamp }]  // GPS trail

`  `}

`  `cancellation: {

`    `isCancelled, cancelledBy, reason, cancellationFee

`  `}

`  `confirmedRequest: ObjectId  // which BookingRequest was confirmed

})
### 4\.3.6 BookingRequest Schema
BookingRequest tracks each individual request sent to a Driver+Owner pair. One Booking can have multiple BookingRequests — one per pair that Passenger selected.

const bookingRequestSchema = new Schema({

`  `booking: ObjectId      // parent Booking reference

`  `passenger: ObjectId

`  `pair: {

`    `driver: ObjectId

`    `owner: ObjectId      // same as driver for Self Driver (combo)

`    `vehicle: ObjectId

`    `isCombo: Boolean     // true = Self Driver

`  `}

`  `driverResponse: "PENDING" | "ACCEPTED" | "REJECTED"

`  `ownerResponse:  "PENDING" | "ACCEPTED" | "REJECTED" | "NA"

`                  `// NA when isCombo = true

`  `status: "PENDING" | "BOTH\_ACCEPTED" | "CONFIRMED" 

`        `| "REJECTED" | "EXPIRED" | "RELEASED" | "CANCELLED"

`  `estimatedFare, distanceKm

`  `requestedAt, expiresAt, respondedAt, confirmedAt

})

**BookingRequest Status Flow:**

PENDING → BOTH\_ACCEPTED → CONFIRMED (passenger selected this one)

`       `→ REJECTED       (driver or owner rejected)

`       `→ EXPIRED        (no response before expiresAt)

`       `→ RELEASED       (another pair was confirmed by passenger)
### 4\.3.7 Trip Schema
Trip document is created when Booking moves to STARTED status. It stores live GPS tracking data.

const tripSchema = new Schema({

`  `bookingId: ObjectId   // one-to-one with Booking

`  `liveTracking: {

`    `isActive: Boolean

`    `currentLocation: { lat, lng, timestamp }

`    `route: [{ lat, lng, timestamp, speed }]  // GPS trail

`  `}

`  `approvals: {

`    `passengerApproval: Boolean

`    `ownerApproval: Boolean

`  `}

`  `completionMethod: "auto" | "manual" | "passenger\_confirmed"

})

**Note on Live Tracking:** Trip schema is fully designed for Socket.io based real-time tracking. Socket.io integration is planned for Phase 2. GPS coordinates are automatically deleted after trip completion per privacy policy.
### 4\.3.8 Wallet Schema
Each user has exactly one Wallet document. The wallet has two separate balance types to clearly separate user-added funds from platform-generated earnings.

const walletSchema = new Schema({

`  `user: ObjectId   // one-to-one with User

`  `addedBalance: Number      // user topped up via UPI/bank — non-withdrawable

`                            `// used for booking payments

`                            `// can go negative for CASH bookings (temporary)

`  `generatedBalance: Number  // earnings from trips, refunds — withdrawable

`                            `// can go negative if Driver owes platform commission

`  `transactions: [{

`    `amount, type: "CREDIT" | "DEBIT"

`    `walletType: "GENERATED" | "ADDED"

`    `status: "PENDING" | "COMPLETED" | "FAILED" | "BLOCKED" | "REFUNDED"

`    `description, relatedBooking, timestamp

`  `}]

})

**Negative Balance Rules:**

- addedBalance can go negative for CASH bookings — restored when passenger confirms cash payment
- generatedBalance can go negative if Driver owes platform commission — next trip blocked until cleared
### 4\.3.9 Review Schema
Cargo implements a 3-sided rating system. Multiple reviews are generated per trip depending on who is involved.

const reviewSchema = new Schema({

`  `bookingId, reviewerId, revieweeId

`  `rating: Number (1-5)

`  `comment: String (max 500 chars)

`  `reviewType: "passenger\_to\_driver" | "passenger\_to\_owner"

`            `| "driver\_to\_passenger" | "owner\_to\_passenger"

`  `isPublic: Boolean

})

// Unique index: one review per reviewer per booking

reviewSchema.index({ bookingId: 1, reviewerId: 1 }, { unique: true })

**Reviews generated per trip:**

|**Reviewer**|**Reviewee**|**What is Rated**|
| :-: | :-: | :-: |
|Passenger|Driver|Driving quality, behavior, punctuality|
|Passenger|Owner/Vehicle|Vehicle condition, cleanliness|
|Driver|Passenger|Behavior, trip detail accuracy|
|Driver|Owner|Vehicle condition as listed vs actual|
|Owner|Driver|Care of vehicle|
|Owner|Passenger|Behavior, accuracy|

**Rating Storage — Independent per entity:**

Driver rating  → stored in User.driverInfo.rating

`                 `(only driving quality — not vehicle)

Vehicle rating → stored in Vehicle.avgRating

`                 `(only vehicle condition — not driver)

Owner rating   → stored in User.publicInfo.rating

Passenger rating → stored in User.publicInfo.rating

A Self Driver with 2 vehicles can have:

- Car avgRating: 4.8 (vehicle condition)
- Bike avgRating: 3.9 (vehicle condition)
- driverInfo.rating: 4.5 (driving quality) All stored and displayed independently.
### 4\.3.10 Notification Schema
const notificationSchema = new Schema({

`  `userId: ObjectId

`  `type: "booking\_request" | "booking\_accepted" | "trip\_started"

`      `| "trip\_completed" | "payment\_received" | "cancellation" | "rating\_received"

`  `title, message

`  `isRead: Boolean

`  `relatedBookingId: ObjectId

})

// Auto-delete after 30 days

notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 })

-----
## 4\.4 API Architecture
All API routes are inside app/api/ following Next.js 15 App Router conventions. Each route is a route.ts file that exports HTTP method handlers (GET, POST, PATCH, DELETE).
### 4\.4.1 API Structure
app/api/

├── auth/

│   ├── login/route.ts        POST — login, returns JWT cookie

│   ├── signup/route.ts       POST — register new user

│   └── logout/route.ts       POST — clear JWT cookie

│

├── bookings/

│   ├── prebooking/route.ts   POST — create scheduled booking ✅

│   └── [id]/

│       └── confirm-pair/route.ts  POST — passenger confirms a pair ✅

│

├── find-ride/

│   └── route.ts              POST — search + generate pairs ✅

│

├── drivers/

│   └── route.ts              GET — fetch available drivers

│

├── vehicles/

│   └── route.ts              GET/POST — vehicle listing

│

├── profile/

│   └── route.ts              GET/PATCH — user profile

│

├── users/

│   └── route.ts              GET — user data

│

├── map/

│   └── route.ts              GET — map/routing helpers

│

└── admin/

`    `├── stats/route.ts        GET — dashboard stats ✅

`    `├── users/route.ts        GET/PATCH — user management ✅

`    `└── bookings/route.ts     GET — booking management ✅
### 4\.4.2 API Request Pattern
Every API route in Cargo follows the same pattern:

export async function POST(req: NextRequest) {

`  `// Step 1: Get and verify JWT token

`  `const token = req.cookies.get("token")?.value;

`  `const payload = verifyToken(token);

`  `if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

`  `// Step 2: Connect to database

`  `await connectToDB();

`  `// Step 3: Parse request body

`  `const body = await req.json();

`  `// Step 4: Business logic

`  `// ...

`  `// Step 5: Return response

`  `return NextResponse.json({ data }, { status: 200 });

}
### 4\.4.3 Key API — Find Ride (/api/find-ride) ✅
This is the most important API in Cargo. It takes passenger's search criteria and returns matching pairs sorted by distance and price.

Input:

`  `vehicleType, pickup coordinates, destination coordinates,

`  `passengerCount, mode ("instant" | "prebooking"),

`  `scheduledDateTime (for prebooking)

Processing:

`  `1. Find nearby Self Drivers (geospatial query on currentLocation)

`  `2. Find nearby Pure Drivers (geospatial or permanentAddress)

`  `3. Find nearby Owners with matching vehicle type

`  `4. Build pairs: Driver + Owner (license ↔ vehicle match)

`  `5. Calculate fare for each pair

`  `6. Sort by: nearest first, then cheapest

`  `7. Return sorted list

Output:

`  `{ results: [...drivers], pairs: [...driverOwnerPairs] }

**Distance calculation:**

- Instant booking → currentLocation (GPS)
- Prebooking → permanentAddress coordinates
### 4\.4.4 Planned APIs 📋

|**API**|**Method**|**Purpose**|
| :-: | :-: | :-: |
|/api/bookings/instant|POST|Create instant booking|
|/api/bookings/[id]/driver-response|PATCH|Driver accept/reject|
|/api/bookings/[id]/owner-response|PATCH|Owner accept/reject|
|/api/bookings/[id]/start-trip|PATCH|Driver starts trip|
|/api/bookings/[id]/end-trip|PATCH|Driver ends trip|
|/api/bookings/[id]/cash-confirm|PATCH|Cash payment confirmation|
|/api/wallet/topup|POST|Add money to wallet|
|/api/wallet/withdraw|POST|Withdraw earnings|
|/api/reviews|POST|Submit review after trip|

-----
## 4\.5 Authentication & Security Flow
### 4\.5.1 Authentication Flow
Cargo uses JWT (JSON Web Token) stored in HTTP-only cookies for authentication. This approach prevents JavaScript-based attacks (XSS) from accessing the token.

SIGNUP:

`  `User fills form → POST /api/auth/signup

`  `→ Password hashed using bcryptjs (salt rounds: 10)

`  `→ User document created in MongoDB

`  `→ Wallet document created (linked to user)

`  `→ JWT token generated (jose library)

`  `→ Token set as HTTP-only cookie

`  `→ User redirected to dashboard

LOGIN:

`  `User fills form → POST /api/auth/login

`  `→ Email/phone lookup in DB

`  `→ bcrypt.compare(inputPassword, hashedPassword)

`  `→ If match → JWT generated → cookie set

`  `→ Redirect to dashboard

LOGOUT:

`  `POST /api/auth/logout

`  `→ Cookie cleared

`  `→ Redirect to home
### 4\.5.2 JWT Token Details
// Token payload

{

`  `id: "user\_mongo\_id",

`  `roles: ["passenger", "driver"],

`  `iat: issued\_at\_timestamp,

`  `exp: expiry\_timestamp

}

// Libraries used:

// jose — for middleware.ts (Edge runtime compatible)

// jsonwebtoken — for API routes (Node.js runtime)
### 4\.5.3 Route Protection Flow
Request comes in

`      `↓

middleware.ts intercepts (runs on Edge)

`      `↓

Is route in protected matcher?

`  `/profile/\*, /dashboard/\*, /admin-panel/\*

`      `↓ YES

Check JWT cookie

`  `→ No token → redirect /login

`  `→ Invalid token → redirect /login

`  `→ Valid token → check role

`      `↓

Role check:

`  `/dashboard/admin/\* → must have "admin" role

`  `Others → any logged-in user allowed

`      `↓

Request passes through to page/API
### 4\.5.4 OTP Verification (Planned) 📋
Current state (testing/demo): Fake phone numbers and emails are accepted — no OTP verification. This was done intentionally to speed up development and testing.

Production plan:

SIGNUP:

`  `User enters phone number

`  `→ SMS OTP sent via MSG91

`  `→ User enters OTP → verified

`  `→ Account created only after OTP success

LOGIN:

`  `Option A — Password based (current)

`  `Option B — OTP based login (planned)

`    `→ Enter phone → OTP sent → enter OTP → logged in

Driver/Owner Verification:

`  `Phone OTP mandatory before document submission

`  `Additional physical verification at district center
### 4\.5.5 Security Measures

|**Measure**|**Implementation**|**Status**|
| :-: | :-: | :-: |
|Password hashing|bcryptjs — 10 salt rounds|✅|
|JWT in HTTP-only cookie|Prevents XSS token theft|✅|
|JWT verification on every protected route|middleware.ts|✅|
|Role-based route protection|middleware.ts + API guards|✅|
|Cloudinary secure upload|Documents/images via Multer|✅|
|MongoDB injection protection|Mongoose ODM|✅|
|HTTPS|Vercel handles SSL|✅|

-----
## 4\.6 Booking Flow
Cargo supports two booking types. The core flow is the same — Passenger searches, selects options, sends requests, approves one — but the timing and available options differ.
### 4\.6.1 Booking Types Comparison

||**Instant Booking**|**Prebooking (Scheduled)**|
| :- | :-: | :-: |
|When|Immediately|Future date/time|
|Who can receive|Self Drivers only|Self Drivers + Driver+Owner pairs|
|Search basis|Current GPS location|Permanent address|
|Request expiry|60 seconds|scheduledDateTime − 2 hours|
|Max requests/day|10 total|10 total (shared limit)|
### 4\.6.2 Request Counting Rule
Each "request" = 1 count regardless of pair type:

`  `Self Driver request    = 1 (even though Driver = Owner)

`  `Driver + Owner request = 1 (even though 2 people involved)

Limit: Max 10 requests per day per Passenger

`       `(shared across Instant + Prebooking)
### 4\.6.3 Instant Booking Flow ✅ Designed / 📋 Being Implemented
1\. Passenger fills: vehicle type + pickup + destination + count

2\. System finds nearby Self Drivers (geospatial query, currentLocation)

3\. Passenger sees sorted list (nearest + cheapest first)

4\. Passenger selects payment method (ONLINE or CASH)

5\. Passenger selects up to 10 options → sends requests

`   `→ BookingRequest created per option (expiresAt: now + 60s)

6\. Self Drivers accept/reject within 60 seconds

7\. Passenger sees accepted drivers → approves one

`   `→ ONLINE: estimatedFare BLOCKED from addedBalance

`   `→ CASH:   addedBalance goes MINUS by estimatedFare

`   `→ All other requests → RELEASED

8\. Booking → ACCEPTED

9\. Driver confirms "Enroute" → Booking: ENROUTE

10\. Driver confirms "Start Trip" → Booking: STARTED, Trip created

11\. GPS tracking active (📋 Socket.io — Phase 2)

12\. Driver confirms "End Trip"

`    `→ GPS calculates actualFare

`    `→ ONLINE: auto payment split

`    `→ CASH: passenger + driver confirm cash exchange

13\. Booking → COMPLETED, ratings exchanged
### 4\.6.4 Prebooking Flow ✅ Partially Implemented
1\. Passenger fills: vehicle type + pickup + destination +

`   `scheduled date/time + passenger count

2\. System generates pairs:

`   `→ Self Driver pairs (using permanentAddress)

`   `→ Driver+Owner pairs (license ↔ vehicle match, permanentAddress)

`   `→ Pair limits: 1 Driver → max 3 Owners, 1 Owner → max 3 Drivers

3\. Passenger sees sorted list (nearest + cheapest first)

4\. Passenger selects payment method

5\. Passenger selects up to 10 options → sends requests

`   `→ BookingRequest per option (expiresAt: scheduledDateTime − 2hrs)

6\. Driver + Owner both must accept → BOTH\_ACCEPTED

`   `(Self Driver: only Driver needs to accept, ownerResponse = NA)

7\. Passenger sees BOTH\_ACCEPTED pairs → confirms one

`   `→ Payment locked (ONLINE: BLOCKED / CASH: MINUS)

`   `→ Other requests → RELEASED

8\. Booking → ACCEPTED

9\. On scheduled day → Driver goes to Owner, picks up vehicle

10\. Driver goes to Passenger → Booking: ENROUTE

11\. Driver confirms "Start Trip" → Booking: STARTED

12\. Trip to destination

13\. Passenger payment settled at destination

14\. Driver returns vehicle to Owner

15\. Driver + Owner confirm "Vehicle Returned"

16\. Final payment split → Booking → COMPLETED

-----
## 4\.6b Cancellation Rules
### 4\.6b.1 Cancellation Cases
**Case 1 — Passenger cancels BEFORE payment lock**

No payment was taken yet

→ Free cancellation, no penalty

→ All BookingRequests → CANCELLED

**Case 2 — Passenger cancels AFTER payment lock, Driver not yet ENROUTE**

Pickup Charge (pre-calculated at booking time):

`  `Self Driver:        C→A km × Rs.1 → 100% Self Driver

`  `Driver+Owner pair:  (C→D km + D→A km) × Rs.1

`                      `→ 60% Driver, 40% Owner

→ Pickup Charge deducted → Driver/Owner split

→ Platform cancellation fee (Rs.10-20) → Platform

→ Remaining → Passenger refund

**Case 3 — Passenger cancels AFTER Driver is ENROUTE**

Driver already travelling to pickup

Pickup Charge (same as Case 2 — pre-calculated):

`  `Self Driver:        C→A km × Rs.1 → 100% Self Driver

`  `Driver+Owner pair:  (C→D km + D→A km) × Rs.1

`                      `→ 60% Driver, 40% Owner

→ Pickup Charge deducted → Driver/Owner split

→ Platform cancellation fee (Rs.10-20) → Platform

→ Remaining → Passenger refund

→ Warning issued to Passenger

**Case 4 — Driver cancels after accepting**

Passenger's fault = zero

→ Full refund → Passenger

→ Driver penalty: rating hit + warning

→ 5 cancellations → account suspended

**Case 5 — Owner rejects after Driver accepted (Pair booking)**

Payment was never locked (BOTH\_ACCEPTED not reached)

→ No payment action needed

→ Owner warning issued

→ Passenger can select another pair

**Case 6 — All requests expire, no one accepts**

Payment never locked

→ No refund needed

→ Passenger notification: "No driver available, try again"

→ No penalty to anyone

**Case 7 — Driver no-show (Prebooking)**

Driver confirmed but did not arrive

→ Full refund + compensation → Passenger

→ Driver: Red card + rating penalty

→ 5 red cards → permanent ban

**Case 8 — Cash booking, Passenger refuses to pay**

Cash booking: Passenger wallet already MINUS at booking time

Driver collects cash directly from Passenger at trip end

If Passenger refuses:

→ Driver reports "Cash Nahi Mila" in app

→ Passenger account BLOCKED (wallet still MINUS)

→ No new bookings until amount is settled

→ Dispute goes to Admin

→ Admin resolves: warning + rating penalty to Passenger

Note: Cash payment gateway integration planned for Phase 2.

`      `Currently cash is handled manually between Driver and Passenger.
### 4\.6b.2 Pickup Charge in Cancellation
Pickup Charge is pre-calculated at booking confirmation time. It is ALWAYS deducted when: Payment was locked AND Passenger cancels.

Self Driver:

`  `C→A distance × Rs.1 → 100% to Self Driver

Driver + Owner pair:

`  `(C→D distance + D→A distance) × Rs.1

`  `→ 60% to Driver

`  `→ 40% to Owner

This compensates Driver/Owner for leaving their home, regardless of how far they had actually travelled at time of cancellation.

-----
## 4\.7 Pricing Model
### Fare Calculation System

The Cargo platform uses a multi-component fare structure designed to fairly compensate all parties:

**Components:**
1. Driver Rate — time-based compensation for driver (hourlyRate × trip hours)
2. Owner Rate — distance-based compensation for vehicle owner (perKmRate × trip km)
3. Platform Fee — ₹1 per km, collected by platform for service
4. Pickup/Return Charge — covers driver travel cost from home to pickup location and back

**Pickup/Return Charge Design:**
- Calculated using driver/owner permanentAddress to pickup distance
- Fixed at booking time — passenger knows exact charge upfront
- Formula: distance × ₹1 × 2 (round trip cost)
- Distributed: 60% to driver, 40% to owner
- Rationale: Passenger benefits from door-to-door service, so travel cost is shared fairly
- Cancellation rule: If passenger cancels after driver starts journey, full fixed charge applies regardless of actual distance covered — this protects driver/owner from loss

**Self Driver Economics:**
- Both driver and owner rates go to same person
- Pickup/Return charge 100% to same person
- Natural economic incentive for self drivers over driver+owner pairs

### 4\.7.2 Market Economics
Self Driver:

`  `Bears own travel cost in his rates

`  `→ Naturally competitive pricing

Driver + Owner pair:

`  `Both must cover their extra travel in their own rates

`  `→ Combined fare naturally higher than Self Driver

`  `→ Passenger will prefer Self Driver when available

Result: Platform does not enforce preference —

`        `pricing economics do it automatically.
### 4\.7.3 Estimated vs Actual Fare
At Booking:

`  `System calculates estimatedFare from map distance + time

`  `ONLINE → estimatedFare BLOCKED from addedBalance

`  `CASH   → addedBalance goes MINUS by estimatedFare

At Trip End:

`  `GPS calculates actualKm + actualDuration automatically

`  `actualFare recalculated with actual values

`  `Actual > Estimated → Extra debited from Passenger addedBalance

`  `Actual < Estimated → Difference refunded to Passenger addedBalance

`  `Dispute            → Admin reviews GPS data manually
### 4\.7.4 Platform Revenue
Per trip commission: Rs.1 per km (A→B distance)

Source: Deducted automatically during payment split at trip end

Cash trips:

`  `Driver collects full amount from Passenger

`  `Platform commission auto-deducted from Driver generatedBalance

`  `If generatedBalance goes negative → next trip blocked until cleared

Online trips:

`  `Platform commission auto-deducted during escrow release

-----
## 4\.8 Admin Panel
The Admin Panel is a separate section of the platform accessible only to users with the admin role. It is built inside the same Next.js application under /dashboard/admin/ and /admin-panel/ routes.
### 4\.8.1 Admin Features
**User Management** ✅ Implemented

\- View all users with filters (by role, status, date)

\- View individual user details + documents

\- Suspend / Ban a user

\- Issue warnings

\- Approve or reject Driver license verification

\- Approve or reject Owner RC + Insurance verification

**Booking Management** ✅ Implemented

\- View all bookings with filters (by status, date, role)

\- View individual booking details

\- Dispute resolution:

`  `→ View GPS trip data

`  `→ View payment records

`  `→ View odometer/km readings

`  `→ Manual resolve: refund or release payment

**Dashboard Stats** ✅ Implemented

\- Total users (breakdown by role)

\- Total bookings (breakdown by status)

\- Active trips count

\- Platform commission earned

**Financial Management** 📋 Planned

\- View negative wallet balance users

\- Track platform commission per trip

\- Transaction history overview
### 4\.8.2 Admin Access Control
Admin role is NOT assignable through normal registration

Admin accounts created manually via script:

`  `→ scripts/create-admin.js

Route protection:

`  `/dashboard/admin/\* → admin role required (middleware.ts)

`  `/api/admin/\*       → admin role verified in every API route

-----
## 4\.9 Implementation Status Summary

|**Section**|**Feature**|**Status**|
| :-: | :-: | :-: |
|**Models**|All 9 MongoDB schemas (PlannedTrip out of scope)|✅ Complete|
|**Auth**|JWT login/signup/logout|✅ Complete|
|**Auth**|OTP verification (SMS via MSG91)|📋 Planned — demo uses fake numbers|
|**Status**|User.status top-level field|📋 Planned — model update needed|
|**Status**|Vehicle.status field|📋 Planned — model update needed|
|**Auth**|Route protection middleware|✅ Complete|
|**RBAC**|Admin role enforcement|✅ Complete|
|**Admin**|User management APIs|✅ Complete|
|**Admin**|Booking management APIs|✅ Complete|
|**Admin**|Dashboard stats|✅ Complete|
|**Booking**|Find-ride + pair generation|✅ Complete|
|**Booking**|Prebooking creation API|✅ Complete|
|**Booking**|Confirm pair API|✅ Complete|
|**Booking**|Instant booking flow|🔄 In Progress|
|**Booking**|Driver/Owner response APIs|📋 Planned|
|**Trip**|Trip start/end APIs|📋 Planned|
|**Payment**|Wallet top-up|📋 Planned|
|**Payment**|Escrow block/release|📋 Planned|
|**Payment**|Cash confirmation flow|📋 Planned|
|**Real-time**|Socket.io live tracking|📋 Phase 2|
|**Notifications**|Push + SMS|📋 Phase 2|
|**Reviews**|Post-trip rating system|📋 Planned|
|**Cancellation**|Full cancellation flow with pickup charge|📋 Planned|
|**Admin**|Financial management|📋 Planned|

-----
*Chapter 4 — System Design & Architecture | Cargo v1.0 | March 2026*

-----
## 4\.9 Security Design
**Note:** This section covers the planned security architecture. Core authentication (JWT, bcrypt, HTTP-only cookies) is implemented. Remaining measures are planned for production phase.
### 4\.9.1 Implemented Security ✅

|**Measure**|**How**|**Status**|
| :-: | :-: | :-: |
|Password hashing|bcryptjs — 10 salt rounds|✅|
|JWT in HTTP-only cookie|Prevents XSS token theft|✅|
|JWT verification|middleware.ts on every protected route|✅|
|Role-based route protection|middleware.ts + API guards|✅|
|Cloudinary secure upload|Documents/images via Multer|✅|
|MongoDB injection protection|Mongoose ODM|✅|
|HTTPS|Vercel handles SSL|✅|
### 4\.9.2 Planned Security 📋
*AI-assisted planning — not yet implemented*

Input Validation:

`  `Zod schemas on all API routes

`  `Prevents malformed data from reaching database

Rate Limiting:

`  `Max 10 booking requests per passenger per day (enforced in DB)

`  `API rate limiting — planned via middleware

OTP Verification:

`  `Phone OTP via MSG91 before account creation

`  `Currently: fake numbers accepted for testing

Driver/Owner Document Verification:

`  `Online upload → Admin reviews → Physical check at district center

`  `Currently: upload works, admin review UI planned

2FA for Admin accounts:

`  `Time-based OTP for admin login

`  `Phase 2 implementation

-----
## 4\.10 Maps & Location Design
**Note:** Leaflet + OpenStreetMap is used for development and testing. Production migration to Google Maps / Ola Maps is planned.
### 4\.10.1 Current Implementation ✅
Library: Leaflet.js + React-Leaflet

Map data: OpenStreetMap (free, no billing)

Used for:

`  `- Location display on booking UI

`  `- Pickup + destination marker selection

`  `- Route visualization

`  `- Distance estimation for fare calculation
### 4\.10.2 Geospatial Query — How Nearby Search Works ✅
MongoDB 2dsphere index on:

`  `User.currentLocation (GeoJSON Point)

`  `Vehicle.currentLocation (GeoJSON Point)

Instant Booking query:

`  `db.users.find({

`    `currentLocation: {

`      `$near: {

`        `$geometry: { type: "Point", coordinates: [lng, lat] },

`        `$maxDistance: 10000  // 10 km radius

`      `}

`    `},

`    `roles: "driver",

`    `status: "ONLINE"

`  `})

Prebooking query:

`  `Same but uses permanentAddress coordinates

`  `Reason: Future trip — driver will be at home
### 4\.10.3 Production Migration Plan 📋
*AI-assisted planning — not yet implemented*

Phase 2: Google Maps API or Ola Maps API

Reasons for upgrade:

`  `- Better rural area coverage across India

`  `- Real-time traffic data for accurate ETA

`  `- Turn-by-turn navigation for drivers

`  `- More accurate distance calculation

Migration approach:

`  `- Map component abstracted behind a wrapper

`  `- Swap Leaflet → Google Maps in one place

`  `- API key setup + billing account required

`  `- Ola Maps preferred for India — better rural coverage

-----
## 4\.11 Onboarding & Verification Flow
*AI-assisted planning based on SRS v2.0 — partial implementation*
### 4\.11.1 Passenger Onboarding ✅
1\. Fill: Name, Phone, Email, Password, Age, Gender

2\. Account created → roles: ["passenger"]

3\. Wallet document created automatically

4\. OTP verification → 📋 Planned (MSG91)
### 4\.11.2 Driver Onboarding 🔄
1\. Existing user fills Driver form:

`   `- License type (MCG / LMV / HGV etc.)

`   `- License number + image upload (Cloudinary) ✅

`   `- Hourly rate set ✅

2\. roles updated: ["passenger", "driver"] ✅

3\. Admin reviews license → Approves/Rejects 📋

4\. Physical verification at district customer service center 📋

`   `- Agent confirms license is valid + matches uploaded copy

`   `- Only after physical check → Driver can go ONLINE
### 4\.11.3 Owner Onboarding 🔄
1\. Existing user fills Owner/Vehicle form:

`   `- Vehicle details (make, model, year, plate) ✅

`   `- RC document upload (Cloudinary) ✅

`   `- Insurance document upload (Cloudinary) ✅

`   `- perKmRate set ✅

`   `- selfDriven toggle ✅

2\. roles updated: ["passenger", "owner"] ✅

3\. Admin reviews RC + Insurance → Approves/Rejects 📋

4\. Physical vehicle inspection at district center 📋

`   `- Agent verifies vehicle condition matches listing

`   `- Mandatory commercial vehicle insurance verified
### 4\.11.4 Self Driver Onboarding 🔄
Same as Owner form with selfDriven toggle ON

Driver form opens below Owner form on same page ✅

Both verifications required (Driver + Owner) 📋

-----
## 4\.12 Rating & Dispute System
*AI-assisted planning based on SRS v2.0 — not yet implemented*
### 4\.12.1 3-Sided Rating System 📋
After every completed trip, ratings are exchanged:

Passenger → Driver    (driving quality, behavior, punctuality)

Passenger → Owner     (vehicle condition, cleanliness)

Driver    → Passenger (behavior, trip accuracy)

Driver    → Owner     (vehicle condition as listed vs actual)

Owner     → Driver    (care of vehicle during trip)

Owner     → Passenger (behavior, accuracy)

All ratings: 1-5 stars + optional text review

Running average displayed on each user profile
### 4\.12.2 Auto-Suspension Rules 📋
Driver/Owner rating drops below 2.5 stars → Account suspended

Passenger rating drops below 2.0 stars    → Account suspended

Suspension review:

`  `User can appeal to Admin

`  `Admin reviews trip history + complaints

`  `Admin can lift suspension or make it permanent

Red Card System (Prebooking no-shows):

`  `Driver confirms booking but does not arrive → Red Card issued

`  `5 Red Cards → Permanent ban

`  `No appeal for permanent ban
### 4\.12.3 Dispute Resolution Flow 📋
Step 1: Either party raises complaint via in-app form

`        `System auto-attaches:

`        `→ Trip GPS data

`        `→ Payment records

`        `→ Timestamps

`        `→ Odometer/km readings (if applicable)

Step 2: District customer service center reviews case

`        `Timeline: Within 24-48 hours

Step 3: Resolution options:

`        `→ Full refund from escrow

`        `→ Partial refund

`        `→ Payment released to Driver/Owner

`        `→ Warning issued

`        `→ Strike or ban applied

Step 4: Both parties notified of resolution

-----
*Chapter 4 — System Design & Architecture | Cargo v1.0 | Next.js 15 | March 2026*



**Chapter 5  Technology Stack**

**5.1  Frontend — Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui**

**5.2  Backend — Node.js, Next.js API Routes, JWT**

**5.3  Database — MongoDB with Mongoose ODM**

**5.4  Dev Tools — ESLint, Turbopack, Cloudinary, Vercel**

**5.5  Technology Choice Justification**

*[ Chapter content will be written here ]*



**Chapter 6  Implementation**

**6.1  Admin Panel — Complete Implementation**

**6.2  Authentication System**

**6.3  User Management Module**

**6.4  Booking Management Module**

**6.5  Ride Booking UI (Frontend Complete)**

**6.6  Dashboard Statistics**

**6.7  Key Code Snippets (TypeScript)**

*[ Chapter content will be written here — main chapter ]*



**Chapter 7  Features & Modules**

**7.1  Implemented Features**

**7.2  Features In Development**

**7.3  Planned Features**

**7.4  Module Interaction Flow**

*[ Chapter content will be written here ]*



**Chapter 8  Testing**

**8.1  Testing Strategy**

**8.2  Admin Panel — Manual Testing**

**8.3  API Endpoint Testing**

**8.4  Test Cases Table**

*[ Chapter content will be written here ]*



**Chapter 9  Results & Screenshots**

**9.1  Admin Login Screen**

**9.2  Dashboard with Live Stats**

**9.3  User Management Interface**

**9.4  Booking Management Interface**

**9.5  Ride Booking UI**

*[ Screenshots will be added here ]*



**Chapter 10  Future Development**

**10.1  Phase 2 — Real-time Tracking, Payment Gateway**

**10.2  Phase 3 — Mobile App (React Native), Analytics**

**10.3  Long-term Vision**

*[ Chapter content will be written here ]*
# Chapter 10 — Future Development
-----
## 10\.1 Overview
Cargo is currently in its MVP (Minimum Viable Product) phase. The admin panel is complete, the core booking system is partially built, and the database is fully designed. This chapter outlines what comes next — in phases, in the order they will be built.

The development plan is divided into three phases that match the business expansion plan — district level, state level, and national level.

-----
## 10\.2 Phase 1 — Complete Core Platform (Current Priority)
These are features that are designed and planned but not yet fully implemented. All of these will be completed before the platform goes live at district level.
### Driver & Owner Response System
Currently the pair generation and prebooking creation APIs are working. What remains is the driver and owner response flow — accepting or rejecting booking requests from their dashboard, with real-time notification when a request arrives.
### Instant Booking Complete Flow
The find-ride API and UI are working. What remains is the full instant booking backend — creating the booking when passenger approves a driver, handling the 60-second expiry, and managing the ENROUTE → STARTED → COMPLETED status flow.
### Trip Start & End APIs
When a driver starts and ends a trip, the system needs to record timestamps, calculate actual distance and duration, and trigger the payment settlement. These APIs are planned and the Trip schema is ready.
### Wallet & Payment Flow
- Wallet top-up via UPI (Razorpay integration)
- Escrow block and release on booking confirmation and trip completion
- Cash booking confirmation flow — driver reports "Cash Mila", passenger wallet MINUS cleared
- Platform commission auto-deduction after each trip
### OTP Verification
Currently fake phone numbers are accepted for testing. Before launch, MSG91 SMS OTP will be integrated for phone verification at registration and for Driver/Owner document submission.
### Rating System
Post-trip rating flow for all three sides — Passenger rates Driver and Owner/Vehicle, Driver rates Passenger and Owner, Owner rates Driver and Passenger. Auto-suspension when rating drops below threshold.
### Cancellation Flow
Full cancellation handling with pickup charge calculation and split — 60% Driver, 40% Owner. Refund processing based on cancellation case.


-----
## 10\.3 Phase 2 — Scale & Real-Time Features
*Planned after Phase 1 is stable and platform has launched at district level*
### Real-Time Driver Tracking (Socket.io)
The Trip schema is already designed for live GPS tracking. Phase 2 will add Socket.io WebSocket integration so passengers can see their driver moving on the map in real time. Driver location updates will be sent every few seconds during an active trip. GPS data will be automatically deleted after trip completion per privacy policy.
### Production Maps Migration
Leaflet + OpenStreetMap will be replaced with Google Maps API or Ola Maps API. Ola Maps is preferred for India because of better rural area coverage and more accurate routing in smaller towns. The map component is already abstracted in the codebase so this migration can be done without changing other parts of the application.
### Push Notifications + SMS
In-app push notifications and SMS fallback via MSG91 for:

- New booking request received
- Driver accepted / rejected
- Driver enroute
- Trip started / completed
- Payment received
- Cancellation alerts

SMS fallback is important for rural areas where smartphone notifications may not be reliable.
### Admin Financial Dashboard
- View all platform commission earnings
- Track negative wallet balance users
- Transaction history overview
- Driver/Owner payout reports
### Automated Document Verification
Currently admin manually reviews uploaded documents. Phase 2 will add a semi-automated check — system flags documents that look unclear or mismatched, admin only reviews flagged ones.

-----
## 10\.4 Phase 3 — National Scale & Mobile App
*Planned after Phase 2 is stable and platform has expanded to state level*
### Mobile Application (React Native)
A dedicated mobile app for Android will be built using React Native. Since the business logic is already in the backend APIs, the mobile app will primarily be a new frontend that connects to the same APIs. React Native was chosen because the team already knows React — code patterns and component thinking carry over directly.

The web platform (Next.js PWA) will remain available — mobile app is an addition, not a replacement.
### Multi-Language Support
The platform will add support for regional Indian languages — Hindi, Marathi, and others based on which regions the platform expands to. This is important for driver and owner adoption in rural areas where English is not comfortable.
### Advanced Analytics Dashboard
- Demand heatmaps by area and time
- Driver earnings trends
- Popular routes
- Cancellation rate analysis
- Data to guide where to expand next
### Dynamic Pricing Guidelines
Owners and Drivers set their own rates — this will always remain. Phase 3 will add a suggested rate range that the platform calculates based on demand in that area. Drivers can still set any rate they want — the suggestion is only a reference.
### Fleet Management for Large Owners
For owners with 5+ vehicles, a dedicated fleet management section — bulk vehicle listing, driver assignment dashboard, earnings per vehicle breakdown.

-----
## 10\.5 Long-Term Vision
The original vision of Cargo was to be a communication platform — not a controller. The long-term goal is to give drivers, owners, and passengers maximum freedom to work together on their own terms, with Cargo simply facilitating the connection.

As the platform grows, the focus will remain on:

**Staying rural-first** — most transport aggregators eventually shift focus to cities where volume is higher. Cargo's competitive advantage is in areas that existing platforms ignore. This will not change.

**Keeping pricing in driver and owner hands** — platform-controlled pricing will never be introduced. The floor rate will exist to prevent exploitation, but the ceiling will always be the driver and owner's choice.

**Expanding vehicle types** — the platform already supports bike, auto, car, bus, and truck. As demand grows, specialized vehicle types like school vans, ambulances (non-emergency), and agricultural transport vehicles will be considered.

**Direct communication between users** — the original idea behind Cargo was a communication bridge. Once trust is established on the platform through the rating system and verification process, direct messaging between passengers and drivers will be introduced so they can coordinate details without going through the app for every interaction.

-----
*Chapter 10 — End*

**Chapter 11  Conclusion**

**11.1  Project Summary**

**11.2  Technical Learning Outcomes**

**11.3  Project Impact**

*[ Chapter content will be written here ]*
# Chapter 11 — Conclusion
-----
## 11\.1 Project Summary
Cargo is a web-based transport aggregator platform built to solve a real problem — the lack of organized, reliable, and affordable transport in non-metro areas of India. The platform connects passengers, drivers, and vehicle owners through a single system where each party has genuine control over their experience.

The core idea behind Cargo was never to build another Ola or Uber. The goal was to build something different — a platform that acts as a communication bridge rather than a controller. Drivers set their own rates. Owners decide how their vehicles are used. Passengers get transparency and choice. The platform stays in the background and simply connects them.

What started as a college diploma project has been designed with real-world deployment in mind. The SRS, rulebook, database design, booking flows, fare calculation, cancellation rules, and dispute resolution system have all been thought through from the ground up — not just for the purpose of submitting a project, but with the intention of actually launching this at district level.

-----
## 11\.2 What Was Achieved
Over the course of this project, the following was completed:

The admin panel was fully built and is live — user management, booking management, dashboard statistics, and role-based access control are all working. This is the operational backbone of the platform.

The authentication system is complete — secure JWT-based login with HTTP-only cookies, bcrypt password hashing, and role-based route protection for all four user types.

The database is fully designed with 9 MongoDB schemas covering every aspect of the platform — users, vehicles, bookings, booking requests, trips, wallets, reviews, and notifications.

The find-ride API and pair generation logic are working — the system can match drivers and owners based on license type, vehicle type, location, and availability, and return sorted results to the passenger.

The prebooking creation and pair confirmation APIs are complete. The booking UI on the frontend is fully built.

A detailed system design was created — covering the complete booking flow for all cases, fare calculation rules, pickup charge logic, cancellation cases with payment handling, and rating and dispute systems.

-----
## 11\.3 What Makes Cargo Different
After reviewing existing platforms in the literature survey, five clear gaps were identified that Cargo addresses:

**Driver and owner controlled pricing** is the most significant differentiator. No existing major platform — Ola, Uber, Rapido, or Porter — allows drivers to set their own per-km or hourly rates. Cargo does. This makes the platform genuinely useful in rural and semi-urban areas where local economics are different from cities.

**Vehicle rental within the platform** is completely new. An owner who cannot drive can list their vehicle for rent. A driver without a vehicle can rent one and start earning. This creates a small ecosystem within the platform that existing apps do not support.

**Multi-purpose transport** under one system — passenger rides, goods transport, and vehicle rentals — means users do not need different apps for different needs.

**Rural-first design** means the platform is built for areas that existing platforms ignore, not adapted for them as an afterthought.

**Communication-first vision** means the long-term goal is to let users coordinate directly — not to control every interaction through the platform.

-----
## 11\.4 Technical Learning Outcomes
Building Cargo provided hands-on experience with technologies and concepts that go well beyond the diploma curriculum:

Working with **Next.js 15 App Router** taught full-stack development — building both the UI and the API in one project, understanding server components, and managing routing at scale.

Designing a **role-based access control system** with JWT authentication taught how real-world security works — not just login and logout, but protecting every route and API endpoint based on who is asking.

Building a **3-sided marketplace** with complex relationships between users, vehicles, and bookings taught how to design a database that can handle real business logic — not just simple CRUD operations.

Working through **booking flows, fare calculations, and cancellation rules** taught how to think through edge cases systematically — what happens when a driver cancels, what happens when no one accepts, what happens when a passenger refuses to pay cash. Every case has a defined outcome.

Writing a proper **SRS and system design document** taught how professional software is planned before it is built — and why that planning saves time during development.

-----
## 11\.5 Honest Assessment
Cargo as a college diploma project is complete in its design and partially complete in its implementation. The admin panel, authentication, database, and core booking APIs represent solid, working software.

As a real product, Cargo has a clear path to launch — the Phase 1 completion list is well-defined, the budget is estimated, the go-to-market strategy is planned, and the team has the technical ability to build it. The biggest challenge, as with any aggregator platform, will be getting the first drivers and passengers on board at the same time.

The decision to start at district level with manual onboarding — not wait until the entire platform is perfect — is the right approach. Real usage will reveal problems that no amount of planning can predict.

-----
## 11\.6 Final Note
Cargo was built with one belief — that technology should work for the people who need it most, not just the people who already have options. Rural transport is a real problem. Drivers in small towns deserve a fair platform. Vehicle owners deserve to earn from what they own. Passengers deserve to know what they are getting before they get in.

That is what Cargo is trying to do.

-----
*Chapter 11 — End*

-----
## Bibliography / References

|**#**|**Source**|**URL / Details**|
| :-: | :-: | :-: |
|1|Ola — Features & Driver Model|https://www.olacabs.com|
|2|Uber India — Zero Commission Model 2025|https://www.uber.com/in/en|
|3|Rapido — Platform Features & Coverage|https://rapido.bike|
|4|Porter — Goods Transport Platform|https://porter.in|
|5|Next.js 15 Documentation|https://nextjs.org/docs|
|6|MongoDB Documentation|https://www.mongodb.com/docs|
|7|Mongoose ODM Documentation|https://mongoosejs.com/docs|
|8|Leaflet.js Documentation|https://leafletjs.com|
|9|Motor Vehicles Act 2019 — Aggregator Guidelines|Ministry of Road Transport & Highways, India|
|10|Tailwind CSS Documentation|https://tailwindcss.com/docs|
|11|Shadcn/ui Documentation|https://ui.shadcn.com|
|12|Cloudinary Documentation|https://cloudinary.com/documentation|
|13|Razorpay Documentation|https://razorpay.com/docs|
|14|MSG91 — SMS Gateway|https://msg91.com|
|15|OpenStreetMap|https://www.openstreetmap.org|

-----
*Cargo — Project Thesis | Sushganga Polytechnic, Wani | Session 2024–2025*

\


**Bibliography / References**

*[ References will be added here ]*
