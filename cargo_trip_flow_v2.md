# Cargo — Complete Trip Flow Guide
> Every possible case from user registration to payment release
> Version 1.0 | March 2026

---

## How to Read This Document

```
[PASSENGER]  = Action by Passenger
[DRIVER]     = Action by Driver
[OWNER]      = Action by Owner  
[SYSTEM]     = Automatic system action
[PAYMENT]    = Wallet/escrow action
```

Status changes shown as: `OLD STATUS → NEW STATUS`

---

## PART 1 — USER SETUP (One Time)

### Step 1.1 — Registration

```
[PASSENGER]
  Name + Phone + Email + Password + Age + Gender fill karo
  → Account created
  → roles: ["passenger"] automatically assigned
  → Wallet document created (addedBalance: 0, generatedBalance: 0)

[DRIVER] (optional — extra step after registration)
  Driver form fill karo:
  → License type select karo (MCG, LMV, HGV etc.)
  → License number + image upload karo (Cloudinary)
  → Hourly rate set karo
  → roles: ["passenger", "driver"] update hota hai
  → Multiple licenses add kar sakte ho (har ek alag type ka)

[OWNER] (optional — extra step after registration)
  Vehicle form fill karo:
  → Vehicle details (make, model, year, plate number)
  → RC document + Insurance upload karo
  → perKmRate set karo
  → selfDriven: false set karo (Pure Owner)
  → roles: ["passenger", "owner"] update hota hai
  → Multiple vehicles list kar sakte ho

[SELF DRIVER] (Driver + Owner combo)
  Owner form fill karo:
  → Vehicle details, RC, Insurance, perKmRate
  → Toggle: "Kya aap khud chalana chahte ho?" → ON karo
  → Toggle ON hone pe neeche Driver form open hota hai (same page)
  → License type, license image, hourlyRate fill karo
  → Submit karo

  [SYSTEM] automatically:
  → selfDriven: true vehicle pe
  → driverInfo.linkedVehicleId = vehicle ka ID
  → vehicle.assignedDriver = driver ka ID
  → roles: ["passenger", "driver", "owner"]
  → UI tag: "Self Driver"

  Note: Toggle OFF rakha → sirf Owner form submit hota hai
  → selfDriven: false → roles: ["passenger", "owner"] → UI tag: "Owner"
```

### Step 1.2 — Wallet Top-Up (Passenger)

```
[PASSENGER]
  Wallet mein paise add karo (UPI / Bank Transfer)
  → addedBalance increase hota hai
  → Transaction record: type: CREDIT, walletType: ADDED
```

---

## PART 2A — INSTANT BOOKING (Self Driver only)

### Step 2A.1 — Passenger Search

```
[PASSENGER]
  Fill karo:
  → Vehicle type (bike/auto/car/bus/truck)
  → Pickup location
  → Destination
  → Passenger count

[SYSTEM]
  Geospatial query run karo:
  → Nearby Self Drivers dhundo (2dsphere index)
  → Filter: vehicleType match + driverInfo.status = AVAILABLE
  → Calculate estimated fare for each:
      Driver hourlyRate × estimated hours
    + Vehicle perKmRate × estimated km (pickup→destination only)
    + Rs.2 platform fee
  → Sort by: nearest first, then cheapest first
  → List passenger ko dikhao
```

### Step 2A.2 — Passenger Selects & Requests

```
[PASSENGER]
  List mein se options select karo aur requests bhejo
  → Pair (Driver + Owner) = 1 request count
  → Self Driver = 1 request count (bhale hi Driver = Owner ho)
  → Max 10 requests per day total (across all bookings)
  → "Send Requests" press karo

[SYSTEM]
  Har selected option ke liye:
  → BookingRequest document create karo
  → status: PENDING
  → expiresAt: now + 60 seconds
  → Notification bhejo: "New booking request!"
```

### Step 2A.3 — Driver Response

```
[SELF DRIVER]
  Notification receive karo
  60 seconds ke andar Accept ya Reject karo

  Case A — Accept:
    BookingRequest → status: BOTH_ACCEPTED
    (isComboTrip: true hone se ownerResponse: NA)
    Passenger ko notification: "Driver X ne accept kiya"

  Case B — Reject:
    BookingRequest → status: REJECTED
    Passenger ko notification: "Driver X ne reject kiya"

  Case C — No response in 60 seconds:
    [SYSTEM] → BookingRequest → status: EXPIRED
    Passenger ko notification: "Driver X ne respond nahi kiya"
```

### Step 2A.4 — Passenger Approves + Payment Method

```
[PASSENGER]
  Jo drivers ne accept kiye hain unki list dekho
  Payment method choose karo:

  ONLINE:
    Wallet mein sufficient balance hona chahiye
    → estimatedFare BLOCKED from addedBalance
    → Transaction: DEBIT, status: BLOCKED

  CASH:
    Wallet balance ki zaroorat nahi
    → Passenger wallet MINUS estimatedFare
    → Booking mein payment.method: CASH marked
    → Driver ko pata chalega: "Passenger cash dega"

  Ek Driver ko APPROVE karo

[SYSTEM]
  Approved BookingRequest → status: CONFIRMED
  Baaki sab BookingRequests → status: RELEASED
  Booking → status: REQUESTED → ACCEPTED
  driver, vehicle, owner IDs booking mein save
```

### Step 2A.5 — Driver Enroute

```
[SELF DRIVER]
  App mein "Start Journey to Passenger" press karo

[SYSTEM]
  Booking → status: ACCEPTED → ENROUTE
  Trip document create karo:
  → liveTracking.isActive: true
  → Passenger ko notification: "Driver aa raha hai"
```

### Step 2A.6 — Trip Start

```
[SELF DRIVER]
  Passenger ke paas pahuncho
  App mein "Start Trip" press karo

[SYSTEM]
  Booking → status: ENROUTE → STARTED
  Trip → startTime: now
  Trip → startLocation: current GPS coordinates
  liveTracking route array mein coordinates record hone lagte hain
  Passenger ko notification: "Trip shuru ho gayi!"
```

### Step 2A.7 — Trip End

```
[SELF DRIVER]
  Destination pe pahuncho
  App mein "End Trip" press karo

[SYSTEM]
  Trip → endTime: now
  Trip → endLocation: current GPS coordinates
  Trip → liveTracking.isActive: false
  actualKm = GPS route se automatically calculate
  actualDuration = endTime - startTime

  finalFare = (platformFee per km × actualKm)
            + (hourlyRate × actualDuration)
            + (perKmRate × actualKm)

  Where platformFee = Rs.1 per km (A→B only)
  Note: Pickup Charge is separate — only applies on cancellation
```

### Step 2A.8 — Payment Settlement (ONLINE)

```
[SYSTEM] fare adjustment:
  finalFare > estimatedFare → extra DEBIT from addedBalance
  finalFare < estimatedFare → difference REFUND to addedBalance
  finalFare = estimatedFare → no adjustment

[SELF DRIVER] confirms "Trip Complete"
  → Driver generatedBalance += driverPayout (full — isComboTrip)
  → Platform commission auto deduct (Rs.1/km × actualKm)
  → Booking → COMPLETED ✅
  → Trip → completed
```

### Step 2A.8b — Payment Settlement (CASH)

```
[PASSENGER] Driver ko cash deta hai (actualFare amount)
[PASSENGER] confirms "Cash De Diya"
  → Passenger wallet minus → NORMAL

[SELF DRIVER] confirms "Cash Mila + Trip Complete"
  → Platform commission auto deduct from Driver generatedBalance
  → Agar Driver wallet minus ho jaaye:
      Next trip BLOCKED — pehle payment karo
  → Booking → COMPLETED ✅
  → Trip → completed
```

### Step 2A.9 — Rating

```
[PASSENGER] → [DRIVER] ko rate karo (1-5 stars)
[PASSENGER] → [OWNER/VEHICLE] ko rate karo (same person — Self Driver)
[DRIVER]    → [PASSENGER] ko rate karo

Driver/Owner avg rating update hota hai
```

---

## PART 2B — PREBOOKING, CASE 1: SELF DRIVER

*(Same as Instant but scheduled for future date)*

### Step 2B.1 — Passenger Search

```
[PASSENGER]
  Fill karo:
  → Vehicle type
  → Pickup + Destination
  → Scheduled date & time
  → Passenger count

[SYSTEM]
  Self Driver pairs + Driver+Owner pairs dono generate karo
  
  Distance calculate karne ke liye:
  → Driver ka permanentAddress use hoga (current location nahi)
  → Owner ka permanentAddress use hoga (current location nahi)
  Reason: Future trip hai — Driver/Owner tab apne ghar pe honge
  
  Sort by: nearest (from permanent address) + cheapest
  List passenger ko dikhao
```

### Step 2B.2 — Passenger Selects & Requests

```
[PASSENGER]
  Options select karo aur requests bhejo
  → Pair (Driver + Owner) = 1 request count
  → Self Driver = 1 request count
  → Max 10 requests per day total (across all bookings)
  → "Send Requests" press karo

[SYSTEM]
  Har selected option ke liye BookingRequest create karo:
  → status: PENDING
  → expiresAt: scheduledDateTime - 2 hours
  → Driver + Owner dono ko notification bhejo
```

### Step 2B.3 — Self Driver Response

```
[SELF DRIVER]
  Notification receive karo
  expiresAt se pehle Accept ya Reject karo

  Accept kiya:
  → BookingRequest status: BOTH_ACCEPTED
  → Passenger ko notification

  Reject / Expire:
  → BookingRequest status: REJECTED / EXPIRED
```

### Step 2B.4 — Passenger Approves + Payment Lock

```
[PASSENGER]
  BOTH_ACCEPTED wali pairs dekho
  Ek confirm karo

[SYSTEM + PAYMENT]
  Same as Instant Step 2A.4
  Booking → ACCEPTED
  estimatedFare BLOCKED in escrow
```

### Step 2B.5 — Scheduled Time Aane Pe

```
[SYSTEM]
  scheduledDateTime - 30 minutes pe:
  → Driver ko reminder notification

[SELF DRIVER]
  Time pe passenger ke paas jao
  App mein "Start Trip" press karo → Trip STARTED

Baaki flow same as Instant (Steps 2A.6 → 2A.9)
```

---

## PART 2C — PREBOOKING, CASE 2: PURE DRIVER + OWNER (Separate People)

*Yeh sabse complex case hai*

### Step 2C.1 — Passenger Search & Pair Generation

```
[PASSENGER]
  Same form fill karo as 2B.1

[SYSTEM]
  Driver+Owner pairs generate karo:
  → Driver ka licenseType ↔ Owner ka vehicleType match check karo
  → Pair ID: {driverId}:{ownerId}:{vehicleId}
  → Distance calculate karne ke liye permanentAddress use hoga:

      Leg 1: Driver permanentAddress → Owner permanentAddress
      Leg 2: Owner permanentAddress  → Passenger pickup location
      Leg 3: Passenger pickup        → Destination
      Leg 4: Destination             → Owner permanentAddress
      Leg 5: Owner permanentAddress  → Driver permanentAddress

  → estimatedFare = total 5-leg distance × rates + Rs.2
  → Sort by nearest (from permanent address) + cheapest
  → Dikhao passenger ko
```

### Step 2C.2 — Passenger Selects & Requests

```
[PASSENGER]
  Options select karo aur requests bhejo
  → Pair (Driver + Owner) = 1 request count
  → Self Driver = 1 request count
  → Max 10 requests per day total (across all bookings)
  → "Send Requests" press karo

[SYSTEM]
  Har pair ke liye BookingRequest:
  → driverResponse: PENDING
  → ownerResponse: PENDING
  → isCombo: false
  → Driver ko notification + Owner ko notification (dono alag)
```

### Step 2C.3 — Driver Response

```
[DRIVER]
  Notification receive karo
  Request details dekho (pickup, destination, scheduled time, fare)
  Accept ya Reject karo

  Accept → driverResponse: ACCEPTED
  Reject → driverResponse: REJECTED
           BookingRequest → REJECTED
           Passenger ko notification
```

### Step 2C.4 — Owner Response

```
[OWNER]
  Notification receive karo
  Request details dekho
  Accept ya Reject karo

  Accept → ownerResponse: ACCEPTED
  Reject → ownerResponse: REJECTED
           BookingRequest → REJECTED
           Passenger ko notification

  Dono ne Accept kiya:
  → BookingRequest → status: BOTH_ACCEPTED
  → Passenger ko notification: "Driver X + Owner Y ne accept kiya"
```

### Step 2C.5 — Passenger Approves + Payment Method

```
[PASSENGER]
  BOTH_ACCEPTED pairs dekho
  Payment method choose karo:

  ONLINE:
    → estimatedFare BLOCKED from addedBalance
    → Transaction: DEBIT, status: BLOCKED

  CASH:
    → Passenger wallet MINUS estimatedFare
    → payment.method: CASH
    → Driver + Owner dono ko pata: "Passenger cash dega"

  Ek pair confirm karo

[SYSTEM]
  Confirmed pair → BookingRequest: CONFIRMED
  Baaki → RELEASED
  Booking → ACCEPTED
  driver, owner, vehicle IDs booking mein save
```

### Step 2C.6 — Trip Day: Driver Moves to Owner

```
[SYSTEM]
  scheduledDateTime - 30 min pe Driver ko reminder

[DRIVER]
  Owner ke paas vehicle lene jao (Leg 1)
  App mein "Reached Owner" press karo
  Booking → status: ACCEPTED (no change yet)
```

### Step 2C.7 — Driver Picks Up Vehicle from Owner

```
[OWNER]
  Vehicle Driver ko handover karo
  App mein "Vehicle Handed Over" confirm karo

[SYSTEM]
  Vehicle → assignedDriver: driver ID
  Driver → linkedVehicleId: vehicle ID
  Driver ko notification: "Ab passenger ke paas jao"
```

### Step 2C.8 — Driver Enroute to Passenger

```
[DRIVER]
  Owner ke location se Passenger ke pickup pe jao (Leg 2)
  App mein "Enroute to Passenger" press karo

[SYSTEM]
  Booking → status: ACCEPTED → ENROUTE
  Trip document create:
  → liveTracking.isActive: true
  Passenger ko notification: "Driver aa raha hai — ETA X minutes"
```

### Step 2C.9 — Trip Start

```
[DRIVER]
  Passenger ke paas pahuncho
  App mein "Start Trip" press karo

[SYSTEM]
  Booking → ENROUTE → STARTED
  Trip → startTime: now
  Trip → startLocation: current GPS
  GPS tracking active
  Passenger ko notification: "Trip shuru!"
```

### Step 2C.10 — Trip End at Destination

```
[DRIVER]
  Destination pe pahuncho
  Passenger utro
  App mein "End Trip" press karo

[SYSTEM]
  Trip → endTime: now
  actualKm (Leg 3 only) + total trip legs GPS se calculate
  finalFare calculate karo
  Booking → STARTED → COMPLETED (temporarily)
```

### Step 2C.11 — Driver Returns Vehicle to Owner

```
[DRIVER]
  Owner ke paas vehicle wapas karo (Leg 4)
  App mein "Vehicle Returned" press karo

[OWNER]
  Vehicle receive karo
  App mein "Vehicle Received" confirm karo

[SYSTEM]
  Vehicle → assignedDriver: null
  Driver → linkedVehicleId: null (for this trip)
  Booking → fully COMPLETED
```

### Step 2C.12 — Payment Release

```
[PAYMENT]
  finalFare calculate (5-leg total)
  Adjustment same as Instant Case A/B/C

  Split:
  → Driver generatedBalance += driverPayout (hourlyRate portion)
  → Owner generatedBalance += ownerPayout (perKmRate portion)
  → Platform: Rs.1/km × actualKm commission

  Transactions:
  → Passenger: DEBIT, ADDED wallet
  → Driver: CREDIT, GENERATED wallet
  → Owner: CREDIT, GENERATED wallet
```

### Step 2C.13 — Rating

```
[PASSENGER] → [DRIVER] rate karo
[PASSENGER] → [OWNER/VEHICLE] rate karo
[DRIVER]    → [PASSENGER] rate karo
[DRIVER]    → [OWNER] rate karo (vehicle condition as listed vs actual)
[OWNER]     → [DRIVER] rate karo (vehicle care)
[OWNER]     → [PASSENGER] rate karo
```

---

## PART 3 — CANCELLATION CASES

### Case 1 — Passenger Cancels Before Payment Lock

```
[PASSENGER] cancels (before approving any pair)

[SYSTEM]
  Sab BookingRequests → CANCELLED
  Booking → CANCELLED
  No payment taken — nothing to refund
  No penalty to anyone
```

### Case 2 — Passenger Cancels After Payment Lock

```
[PASSENGER] cancels after approving a pair

[SYSTEM]
  Booking → CANCELLED
  cancelledBy: PASSENGER

[PAYMENT] — ONLINE:
  Pickup Charge (perKmRate × 1 km) → Driver/Owner generatedBalance
  Platform fee (Rs.10-20) → Platform
  Remaining → Passenger addedBalance refund

[PAYMENT] — CASH:
  Pickup Charge deduct from Passenger wallet MINUS amount
  Platform fee deduct
  Remaining MINUS → cleared

  Note: Pickup charge ALWAYS deducted — 
        chahe Driver nikla ho ya nahi nikla ho
  Driver ko notification: "Passenger ne cancel kiya"
```

### Case 3 — Driver Cancels After Accepting

```
[DRIVER] cancels after accepting booking

[SYSTEM]
  BookingRequest → CANCELLED
  cancelledBy: DRIVER

[PAYMENT]
  Passenger ka blocked amount → fully UNBLOCK
  Full refund → Passenger addedBalance

  Driver penalty:
  → Rating hit
  → Warning issued
  → 5 cancellations → account suspension
```

### Case 4 — Owner Rejects After Driver Accepted

```
[OWNER] rejects request

[SYSTEM]
  BookingRequest → REJECTED
  Passenger ko notification: "Ek pair available nahi"
  Passenger can select another pair

[PAYMENT]
  Payment abhi lock nahi tha → no action needed
  Owner warning issued
```

### Case 5 — No One Accepts (All Expired)

```
[SYSTEM]
  Sab BookingRequests → EXPIRED
  Booking → CANCELLED
  Payment kabhi lock nahi hua → no refund needed

  Passenger ko notification:
  "Koi driver available nahi. Please dobara try karein."
```

### Case 6 — Driver No-Show (Prebooking)

```
[SYSTEM] detects Driver did not arrive by scheduled time

[PAYMENT]
  Full refund + compensation → Passenger

  Driver penalty:
  → Red card issued
  → Rating penalty
  → 5 red cards → permanent ban
```

### Case 7 — Cash Booking, Passenger Refuses to Pay

```
[DRIVER] reports "Cash Nahi Mila" in app

[SYSTEM]
  Passenger wallet already MINUS
  → Passenger account BLOCKED
  → No new bookings until cash settled
  → Dispute sent to Admin

[ADMIN]
  Reviews case
  → Warning + rating penalty to Passenger
  → Resolution recorded
```

---

## PART 4 — QUICK SUMMARY TABLE

| Scenario | Payment Lock | Trip Start | Payment Release |
|---|---|---|---|
| Instant — Self Driver | Passenger approves | Driver confirms | Trip completed |
| Prebooking — Self Driver | Passenger approves | Driver confirms on scheduled time | Trip completed |
| Prebooking — Driver+Owner | Passenger approves | Driver confirms after vehicle pickup | Vehicle returned + trip completed |
| Passenger cancels early | Never locked | — | Nothing to refund |
| Passenger cancels late | Locked | — | Partial refund |
| Driver cancels | Locked | — | Full refund to passenger |
| All requests expire | Never locked | — | Nothing to refund |

---

*Cargo Trip Flow Guide v1.0 | March 2026 | Internal Use Only*
