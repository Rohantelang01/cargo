# Cargo Platform — Rulebook v1.0
> Internal reference document for Chapter 4 (System Design & Architecture)
> Based on: SRS v2.0 + actual codebase analysis + confirmed decisions

---

## SECTION 1 — USER ROLES

### 1.1 Role Architecture

**Database mein 3 roles hain. UI mein 4 tags dikhte hain.**

| DB Roles Array | UI Display Tag | Meaning |
|---|---|---|
| `["passenger"]` | 🟢 Passenger | Default user — sirf booking kar sakta hai |
| `["passenger", "driver"]` | 🔵 Driver | License hai, gaadi nahi — rent pe chalata hai |
| `["passenger", "owner"]` | 🟠 Owner | Gaadi hai, khud nahi chalata — rent pe deta hai |
| `["passenger", "driver", "owner"]` | 🟣 Self Driver | Gaadi bhi hai, khud bhi chalata hai |
| `["admin"]` | Admin | Internal only — platform management |

> **Key Rule:** "Self Driver" sirf ek UI label hai. Backend mein koi alag role nahi — sirf `driver` + `owner` dono roles ek saath hain aur vehicle pe `selfDriven: true` flag hai.

---

### 1.2 Passenger Rules

- Har registered user default se Passenger hota hai
- Koi document verification nahi chahiye
- Instant booking aur Prebooking dono kar sakta hai
- Trip ke baad Driver aur Owner/Vehicle dono ko rate kar sakta hai
- Sirf Wallet (addedBalance) se payment kar sakta hai — Cash support abhi nahi hai

---

### 1.3 Driver Rules

- Sirf chalata hai — apni koi gaadi nahi hoti
- Ek ya zyada license types ho sakti hain (array of licenses)
- **Har license ka type alag hona chahiye** — same type dobara nahi
- Har license ke liye alag `hourlyRate` set kar sakta hai
- **Driver ka status Driver level pe hota hai — license level pe nahi**
  - `OFFLINE` → koi bhi license visible nahi
  - `AVAILABLE` → saari active licenses visible
  - `ON_TRIP` → system automatically set karta hai — saari licenses unavailable
  - `SCHEDULED` → aage ki confirmed booking hai
  - `UNAVAILABLE` → online hai lekin booking nahi leni
- `license.isActive` = permanent disable (jaise license expire ho gayi)
- **Sirf Prebooking** le sakta hai (Pure Driver — bina apni gaadi ke)
- Trip ke baad Passenger ko rate kar sakta hai

---

### 1.4 Owner Rules

- Sirf tab consider hoga jab `selfDriven: false`
- Apni gaadi rent pe deta hai — khud nahi chalata
- Ek ya zyada vehicles list kar sakta hai
- Ek hi type ke multiple vehicles ho sakte hain (3 cars, 2 bikes — sab allowed)
- Har vehicle ka status independent hota hai
- Har vehicle pe alag Driver assign hoga
- **Sirf Prebooking** mein participate kar sakta hai (Pure Owner)
- Trip ke baad Driver aur Passenger dono ko rate kar sakta hai

---

### 1.5 Self Driver Rules

- `roles: ["passenger", "driver", "owner"]` + `selfDriven: true` on vehicle
- Apni gaadi khud chalata hai
- **Dono rates lega:**
  - Driver rate → `driverInfo.licenses[].hourlyRate` (per hour)
  - Vehicle rate → `Vehicle.perKmRate` (per km)
- Booking mein `isComboTrip: true` set hoga
- **Instant Booking aur Prebooking dono** le sakta hai
- Linking:
  - Driver side → `driverInfo.linkedVehicleId`
  - Vehicle side → `assignedDriver` + `selfDriven: true`

---

## SECTION 1b — USER & VEHICLE STATUS DESIGN

### User Status (Top Level — All Roles)

```
status: 'OFFLINE' | 'ONLINE' | 'ON_TRIP'
```

**Driver Rules:**
```
OFFLINE → ONLINE: Manual toggle (one button)
ONLINE → ON_TRIP: System sets automatically (trip start)
ON_TRIP → ONLINE: System sets automatically (trip end)
ON_TRIP → OFFLINE: ❌ Blocked during active trip

All licenses affected by User.status:
  OFFLINE → all licenses invisible
  ON_TRIP → all licenses unavailable (one person, one job)
  ONLINE  → active licenses available for matching
```

**Owner Rules:**
```
status: 'OFFLINE' | 'ONLINE' only (no ON_TRIP)
Owner does not drive — vehicles can be ON_TRIP simultaneously

OFFLINE: All vehicles overridden to OFFLINE
ONLINE:  Each vehicle manages its own status independently
```

**Self Driver Rules:**
```
Same as Driver rules
User.status + Vehicle.status stay in sync:
  ONLINE  → Vehicle: AVAILABLE
  ON_TRIP → Vehicle: ON_TRIP
  OFFLINE → Vehicle: OFFLINE
```

### Vehicle Status (Independent per Vehicle)

```
status: 'OFFLINE' | 'AVAILABLE' | 'ON_TRIP'

Owner with 3 vehicles:
  Car 1 → ON_TRIP (with Driver A)
  Car 2 → AVAILABLE
  Car 3 → OFFLINE (manually disabled)
```

---

### 1.6 Tag Display Rules (UI)

**Tags are computed dynamically based on roles array + vehicle selfDriven status**

#### Self Driver Tag:
- **Condition:** roles includes 'driver' + 'owner' AND all vehicles have selfDriven: true
- **Display tag:** "Self Driver"
- **Number badge:** count of their vehicles

#### Self Driver + Owner Tag:
- **Condition:** roles includes 'driver' + 'owner' AND some vehicles selfDriven: true, some selfDriven: false
- **Display tag:** "Self Driver + Owner"
- **Number badge:** show separately — [X] Self Driver vehicles, [Y] Owner vehicles

#### Owner Tag:
- **Condition:** roles includes 'owner' only, all vehicles selfDriven: false
- **Display tag:** "Owner"
- **Number badge:** total vehicle count

#### Driver Tag:
- **Condition:** roles includes 'driver' only, no vehicles
- **Display tag:** "Driver"
- **Number badge:** total license count

---

### 1.7 Self Driver Vehicle Reserve Rule:
- A vehicle with `selfDriven: true` is **PERMANENTLY RESERVED** for the owner/driver only
- It cannot be assigned to any other driver
- It cannot be rented out to anyone else
- In find-ride results, this vehicle will only appear paired with its owner
- `assignedDriver` field must always equal `owner._id` when `selfDriven: true`
- This rule must be enforced at API level — no other driver can be linked to this vehicle

---

### 1.8 Multiple License / Multiple Vehicle Badge Rule:
- If a Driver has 2+ licenses → show number badge on Driver tag (e.g. "Driver [3]")
- If an Owner has 2+ vehicles → show number badge on Owner tag (e.g. "Owner [3]")
- If Self Driver has 2+ vehicles → show number badge (e.g. "Self Driver [2]")
- If Self Driver + Owner → show separate badges for each role

---

## SECTION 2 — LICENSE ↔ VEHICLE MATCHING

```
MCWOG / MCG    →  bike
3W-NT / 3W-T   →  auto
LMV-NT / LMV   →  car
HMV / HGV      →  truck
HPMV           →  bus
```

> This mapping is defined in `User.ts` as `LICENSE_VEHICLE_MAP` and enforced at query level.

---

## SECTION 3 — BOOKING RULES

### 3.1 Booking Type Access

| User Type | Instant Booking | Prebooking |
|---|---|---|
| Passenger | ✅ (book kar sakta hai) | ✅ (book kar sakta hai) |
| Self Driver | ✅ (le sakta hai) | ✅ (le sakta hai) |
| Pure Driver | ❌ | ✅ |
| Pure Owner | ❌ | ✅ |

> **Reason:** Instant booking ke liye gaadi + driver ek hi waqt pe ready chahiye. Pure Driver + Owner pair ke liye dono ka simultaneously available hona practically mushkil hai. Self Driver ke paas dono hain — isliye wahi Instant le sakta hai.

---

### 3.2 Instant Booking Flow

```
Passenger → vehicle type + pickup + destination fill karta hai
          ↓
System → nearby Self Drivers dhundta hai (geospatial query)
          ↓
Passenger ko list milti hai — sorted by distance + price
          ↓
Passenger multiple Self Drivers ko ek saath request bhejta hai (max 10)
          ↓
Har ek ke liye BookingRequest create → expiresAt: now + 60 seconds
          ↓
Jo bhi Self Driver accept kare → Passenger ke paas aata hai
          ↓
Passenger ek ko approve karta hai → Booking: ACCEPTED
Baaki requests → RELEASED
          ↓
Driver arrives → Trip: STARTED
          ↓
Trip khatam → Booking: COMPLETED → Payment release
```

---

### 3.3 Prebooking Flow

#### Step 1 — Passenger Search
```
Passenger fills:
- Pickup + Destination
- Vehicle type
- Scheduled date & time
- Passenger count
```

#### Step 2 — Pair Generation (System)
System teen types ke pairs banata hai:

**Type A — Self Driver (Combo)**
```
Driver === Owner === same person
selfDriven: true
Pair ID: {userId}:{userId}:{vehicleId}
ownerResponse: NA (sirf driver accept karega)
```

**Type B — Pure Driver + Pure Owner**
```
Driver aur Owner alag alag log hain
License type ↔ Vehicle type match hona chahiye
Pair ID: {driverId}:{ownerId}:{vehicleId}
Dono ka response chahiye: driverResponse + ownerResponse
```

**Pair Generation Limits:**
- 1 Driver → max 3 Owners ke saath pair ho sakta hai
- 1 Owner → max 3 Drivers ke saath pair ho sakta hai
- Sort by: nearest first, then cheapest first

**Location used for distance calculation:**
- Instant Booking → Driver/Owner current GPS location
- Prebooking → Driver/Owner permanentAddress
  Reason: Future trip hai — Driver/Owner tab apne ghar pe honge

#### Step 3 — Passenger Selection
```
Passenger ko sorted list milti hai
(best pairs top pe — nearest + cheapest first)

Note: Technically ek Driver ya Owner ke max 3 pairs ban sakte hain
lekin passenger ko sirf best pairs dikhti hain — saari nahi

Passenger apni marzi se max 10 pairs select kar sakta hai
Sab selected pairs ko ek saath request jaati hai
```

#### Step 4 — Driver + Owner Response
```
BookingRequest status: PENDING
expiresAt: scheduledDateTime - 2 hours

Combo trip:
  Driver accepts → BOTH_ACCEPTED (owner NA hai)

Separate Driver + Owner:
  Dono accept karein → BOTH_ACCEPTED
  Koi ek reject kare → REJECTED
  Time expire → EXPIRED
```

#### Step 5 — Passenger Confirmation
```
Passenger ke paas BOTH_ACCEPTED wali pairs aati hain
Passenger ek confirm karta hai
→ Confirmed pair: Booking status: ACCEPTED
→ Baaki pairs: status: RELEASED
```

#### Step 6 — Trip Progression
```
ACCEPTED → ENROUTE → STARTED → COMPLETED
```

---

### 3.4 Fare Calculation

```
Total Fare = Platform Fee + Driver Rate + Vehicle Rate

Platform Fee = Rs.1 per km × A→B km
Driver Rate  = driverInfo.licenses[].hourlyRate × A→B hours
Vehicle Rate = Vehicle.perKmRate × A→B km

All three calculated on A→B (pickup to destination) ONLY.

Self Driver:
  Dono rates same user ko milte hain
  isComboTrip: true

Separate Driver + Owner:
  Driver → driverPayout (hourly rate wala hissa)
  Owner  → ownerPayout (per km rate wala hissa)
  Platform → ₹2
```

---

## SECTION 4 — IMPLEMENTATION STATUS

| Feature | Status |
|---|---|
| User model (all roles) | ✅ Implemented |
| Vehicle model | ✅ Implemented |
| Booking model | ✅ Implemented |
| BookingRequest model | ✅ Implemented |
| Trip model | ✅ Implemented |
| Wallet model | ✅ Implemented |
| Review model | ✅ Implemented |
| Notification model | ✅ Implemented |
| Pair generation logic (find-ride API) | ✅ Implemented |
| Prebooking creation API | ✅ Implemented |
| Confirm pair API | ✅ Implemented |
| Driver/Owner response APIs | 📋 Planned |
| Instant booking flow | 📋 Planned |
| Live tracking (Socket.io) | 📋 Planned — Trip schema ready |
| Payment processing (Razorpay) | 📋 Planned |
| Real-time notifications | 📋 Planned |
| Expired requests auto-cleanup | 📋 Planned |
| Admin panel | 🔄 In Progress |

---

*Cargo Rulebook v1.0 | March 2026 | Internal Use Only*

---

## SECTION 5 — FARE CALCULATION & PAYMENT RULES

### FARE CALCULATION RULES (Updated)

#### Components of Total Fare:

**1. Driver Rate (Time Based)**
- Driver hourlyRate × estimated trip hours
- Only covers pickup → destination time
- Goes to Driver

**2. Owner Rate (Distance Based)**  
- Vehicle perKmRate × estimated km (pickup → destination only)
- Goes to Owner

**3. Platform Fee**
- ₹1 × total km (pickup → destination)
- Goes to Platform

**4. Pickup/Return Charge (NEW)**
- Calculated at booking time using: Driver/Owner permanentAddress → Pickup location distance
- Formula: distance(km) × ₹1 × 2 (×2 because driver returns home after trip)
- This amount is FIXED at booking time — does not change based on actual travel
- Example: Driver lives 30km from pickup → Pickup charge = 30 × ₹1 × 2 = ₹60
- Distribution: 60% → Driver, 40% → Owner
- Self Driver case: 100% goes to same person (60% + 40%)

#### Total Fare Formula:
Total Fare = Driver Rate + Owner Rate + Platform Fee + Pickup/Return Charge
= (hourlyRate × hours) 
+ (perKmRate × km) 
+ (₹1 × km) 
+ (pickupDistance × ₹1 × 2)

#### Self Driver Case:
Same formula applies
Driver Rate + Owner Rate both go to same person
Pickup/Return Charge 100% goes to same person
isComboTrip: true

#### Pickup/Return Charge Rules:
RULE 1 — Charge is calculated at booking time from permanentAddress
RULE 2 — Amount is FIXED — does not change based on actual km travelled
RULE 3 — Passenger pays full pickup charge if:
→ Trip is COMPLETED (driver came and completed trip)
→ Passenger cancels AFTER driver has started journey (ENROUTE status)
RULE 4 — Passenger pays ZERO pickup charge if:
→ Passenger cancels BEFORE driver starts journey
→ Driver cancels (driver's fault)
RULE 5 — If driver starts journey (ENROUTE), passenger cancels:
Full fixed pickup charge applies regardless of how far driver travelled
Even if driver only travelled 1km out of 30km — full ₹60 applies
RULE 6 — Distribution: 60% Driver, 40% Owner (100% Self Driver)

#### Example Calculation:
Scenario: Car booking, 40km trip, driver lives 30km from pickup
Driver hourlyRate = ₹100/hr, estimated time = 1.5hr
Vehicle perKmRate = ₹12/km
Pickup distance = 30km

Driver Rate        = ₹100 × 1.5        = ₹150
Owner Rate         = ₹12 × 40          = ₹480
Platform Fee       = ₹1 × 40           = ₹40
Pickup/Return      = 30 × ₹1 × 2       = ₹60
─────
Total Fare                             = ₹730

Pickup charge split:
Driver gets: ₹60 × 60% = ₹36
Owner gets: ₹60 × 40% = ₹24

---

### 5.2 Escrow Payment Flow

**Case 1 — Before payment lock:**
```
Free cancellation — no penalty, no charge
```

**Case 2 — After payment lock, Driver not ENROUTE:**
```
Pickup Charge (perKmRate × 1km) → Driver/Owner
Platform fee (Rs.10-20) → Platform
Remaining → Passenger refund
```

**Case 3 — After payment lock, Driver ENROUTE:**
```
Pickup Charge → Driver/Owner
Platform fee → Platform
Remaining → Passenger refund
Warning issued to Passenger
```

**Case 4 — Driver cancels after accepting:**
```
Full refund → Passenger
Driver: rating penalty + warning
5 cancellations → account suspended
```

**Case 5 — Owner rejects (pair booking):**
```
Payment never locked → no action needed
Owner warning issued
Passenger selects another pair
```

**Case 6 — All requests expire:**
```
No payment taken → nothing to do
Passenger notified to try again
```

**Case 7 — Driver no-show (Prebooking):**
```
Full refund + compensation → Passenger
Driver: red card + rating penalty
5 red cards → permanent ban
```

**Case 8 — Cash booking, Passenger refuses payment:**
```
Passenger wallet already MINUS
→ Passenger account BLOCKED
→ No new bookings until settled
→ Admin resolves dispute
```

**Pickup Charge Rule in Cancellation:**
```
Pickup Charge ALWAYS deducted when:
  Payment was locked AND Passenger cancels
Regardless of how far Driver had travelled
```

### 5.3 Estimated vs Actual Fare

```
At Booking Time (Estimated):
  System maps se minimum estimated distance + time calculate karta hai
  estimatedFare escrow mein lock ho jaata hai

At Trip End (Actual):
  Driver + Passenger dono actual km/time manually confirm karte hain

  Case A — Actual > Estimated:
    Passenger ke wallet se extra amount debit hoga

  Case B — Actual < Estimated:
    Extra amount unblock → wapas passenger ke addedBalance mein

  Case C — Dispute (readings match nahi):
    Admin GPS data dekh ke manually resolve karega
```

### 5.4 Escrow Payment Flow

```
STEP 1 — Booking Approved (Passenger confirms pair):
  estimatedFare → passenger addedBalance se BLOCKED
  Transaction status: BLOCKED
  Na passenger use kar sakta hai, na driver/owner le sakta hai

STEP 2 — Trip Completed:
  Actual fare calculate hota hai
  Adjustment hota hai (extra debit ya refund)
  Final amount automatically split:
    → Driver: generatedBalance mein CREDIT
    → Owner:  generatedBalance mein CREDIT
    → Platform: Rs.2 commission deduct

STEP 3 — Trip Cancelled (by Driver or System):
  Blocked amount fully UNBLOCK
  Wapas passenger ke addedBalance mein
  Driver ko penalty: rating hit + warning issued
```

### 5.5 Wallet Types

```
addedBalance:
  User ne khud top-up kiya (UPI / bank transfer)
  Sirf booking payment ke liye use hoga
  Withdraw nahi ho sakta

generatedBalance:
  Driver/Owner ki trip earnings
  Cancelled trip refunds
  Withdraw ho sakta hai bank account mein
```

### 5.6 Cash Payments

```
Cash payments supported hain.

How it works:
  Passenger wallet MINUS hota hai booking time pe (estimated fare)
  Driver trip end pe Passenger se cash collect karta hai directly
  Driver "Cash Mila" confirm karta hai app mein
  Passenger wallet MINUS → cleared
  Platform commission → Driver generatedBalance se auto-deduct
  If Driver generatedBalance negative → next trip blocked

Phase 2:
  Razorpay / Cashfree payment gateway integrate hoga
  Tab online payments bhi fully supported honge
  Cash flow same rahega — sirf commission collection automated hoga
```

---

## SECTION 6 — REQUEST LIMITS & ANTI-SPAM RULES

### 6.1 Instant Booking Request Limits

**Request Limit Rules:**
```
Maximum 10 requests per 5-minute window
User can select up to 10 Self Drivers simultaneously
After 10 requests → must wait 5 minutes for next batch
No daily limit → unlimited batches with 5-minute gap
```

**Expiry Rules:**
```
Each request expires in exactly 5 minutes
Driver has 5 minutes to ACCEPT or REJECT
No response → automatic EXPIRED status
```

**Reset Logic:**
```
5 minutes complete → all requests resolved (accept/reject/expire)
User can immediately send next batch of 10 requests
Window resets regardless of individual request outcomes
```

**Example Timeline:**
```
10:00 AM → User sends 10 requests
10:02 AM → 3 accept, 2 reject, 5 pending
10:05 AM → All 5 pending auto-expire
10:05 AM → User can send 10 new requests immediately
```

### 6.2 Prebooking Request Limits

**Request Limit Rules:**
```
Maximum 10 requests per 5-hour window
User can select up to 10 Driver+Owner pairs
After 10 requests → must wait 5 hours for next batch
Maximum 5 active prebookings allowed at any time
```

**Expiry Rules:**
```
Each request expires 1 day before scheduled trip
Trip: March 24, 2:00 PM → Request expires: March 23, 2:00 PM
Both Driver AND Owner must respond before expiry
```

**Reset Logic:**
```
5 hours from first batch → can send new batch
Even if all requests resolved early → 5-hour window still applies
Active prebookings count towards 5-booking limit
```

**Example Timeline:**
```
Day 1, 10:00 AM → User sends 10 prebooking requests
Day 1, 3:00 PM  → 5-hour window active → no new requests
Day 2, 2:00 PM  → All requests expire (1 day before trip)
Day 2, 3:00 PM  → 5-hour window complete → new requests allowed
```

### 6.3 Anti-Spam Protection System

**Account Reputation System:**
```
New Users: Limited to 5 requests per batch (first 3 trips)
Regular Users: 10 requests per batch (after 3 completed trips)
High Rejection Rate (>80%): Flagged for admin review
```

**Rate Limiting:**
```
API endpoint: /api/booking-request/create
Rate limit: 1 request per second per user
Enforced at server level using Redis
Prevents automated bot attacks
```

**Penalty System:**
```
3 consecutive batches with 100% rejection → 30-minute cooldown
Cancel after driver accepts → 1 warning issued
5 warnings total → Account review by admin
```

**Fair Usage Monitoring:**
```
Request/Trip Ratio Tracking:
Healthy ratio: < 5:1 (50 requests sent, 10 trips completed)
Suspicious ratio: > 20:1 → Account automatically flagged
```

### 6.4 Database Schema Updates

**User Collection - New Fields:**
```javascript
{
  requestLimits: {
    instant: {
      lastBatchSentAt: Date,        // Last batch timestamp
      requestsInCurrentBatch: Number, // 0-10
      nextBatchAllowedAt: Date       // When next batch allowed
    },
    prebooking: {
      lastBatchSentAt: Date,
      requestsInCurrentBatch: Number,
      nextBatchAllowedAt: Date,
      activeBookingsCount: Number    // 0-5 max
    }
  },
  reputation: {
    totalRequestsSent: Number,
    totalTripsCompleted: Number,
    rejectionRate: Number,           // Percentage
    warningCount: Number,           // 0-5 max
    penaltyEndsAt: Date             // Cooldown end time
  }
}
```

### 6.5 API Validation Logic

**Instant Booking Validation:**
```javascript
// Before creating request
if (mode === 'instant') {
  const timeSinceLastBatch = now - user.requestLimits.instant.lastBatchSentAt;
  
  if (timeSinceLastBatch < 5 minutes) {
    return error: "Please wait. Next batch available in X minutes";
  }
  
  if (user.requestLimits.instant.requestsInCurrentBatch >= 10) {
    return error: "Maximum 10 requests per batch. Wait for expiry.";
  }
}
```

**Prebooking Validation:**
```javascript
if (mode === 'prebooking') {
  const timeSinceLastBatch = now - user.requestLimits.prebooking.lastBatchSentAt;
  
  if (timeSinceLastBatch < 5 hours) {
    return error: "Please wait. Next batch available in X hours";
  }
  
  if (user.requestLimits.prebooking.activeBookingsCount >= 5) {
    return error: "Maximum 5 active prebookings allowed";
  }
  
  if (scheduledDateTime < (now + 24 hours)) {
    return error: "Prebooking requires at least 24 hours advance notice";
  }
}
```

### 6.6 Automatic Cleanup System

**Cron Job - Every 1 Minute:**
```javascript
// Check all PENDING requests
if (request.mode === 'instant' && (now - createdAt) > 5 minutes) {
  request.status = 'EXPIRED';
  notifyPassenger("Request expired - no driver response");
  decrementUserBatchCounter(request.userId);
}

if (request.mode === 'prebooking' && now > (scheduledDateTime - 24 hours)) {
  request.status = 'EXPIRED';
  notifyPassenger("Prebooking expired - 24h before trip");
  notifyDriver("Prebooking request expired");
  notifyOwner("Prebooking request expired");
  decrementUserBatchCounter(request.userId);
}
```

### 6.7 Edge Cases & Special Scenarios

**Instant Booking Edge Cases:**
```
Case 1: Mixed responses within 2 minutes
- 5 accept, 3 reject, 2 pending
- User still cannot send new requests until 5-minute window complete
- Remaining 2 requests auto-expire at 5-minute mark

Case 2: Passenger approves driver early
- Passenger approves 1 driver at 10:03 AM
- Remaining 9 requests auto-cancel immediately
- 5-minute window still applies for next batch
- Next batch available at 10:05 AM (not 10:03 AM)

Case 3: User closes app
- All 10 requests remain active in backend
- Requests expire after 5 minutes regardless
- User can send new batch when returning (if 5 minutes passed)
```

**Prebooking Edge Cases:**
```
Case 1: Quick acceptance (both accept in 1 hour)
- Driver and Owner both accept within 1 hour
- 5-hour window still applies - no new requests until 5 hours complete
- User has 1 active prebooking (counts towards 5-booking limit)

Case 2: User cancels approved prebooking
- User cancels after Driver+Owner both accepted
- 1-hour penalty before next prebooking allowed
- 5-hour window resets from cancellation time + 1 hour

Case 3: Last-minute booking attempt
- User tries to book for same day (less than 24 hours away)
- System blocks: "Prebooking requires 24 hours advance notice"
- User directed to use Instant Booking instead
```

### 6.8 User Experience Guidelines

**UI Messaging:**
```
Before sending requests: "You can send up to 10 requests. Choose wisely!"
During window: "Next batch available in X minutes/hours"
At limit: "Maximum requests sent. Please wait for expiry."
After expiry: "Requests expired. Send new batch now!"
```

**Countdown Display:**
```
Instant: "Next batch in 2:45 minutes"
Prebooking: "Next batch in 3:12 hours"
Real-time updates every second
```

**Error Messages:**
```
Rate limit: "Too many requests. Please try again in 1 second."
Batch limit: "Maximum 10 requests per batch."
Time window: "Please wait X minutes before next batch."
Booking limit: "Maximum 5 active prebookings allowed."
```

---

*Cargo Rulebook v2.0 | March 2026 | Internal Use Only*
