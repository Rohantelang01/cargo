# Chapter 4 — System Design & Architecture
**Project:** Cargo — Smart Transport Aggregator Platform **Version:** 1.0 | March 2026 **Tech Stack:** Next.js 15, MongoDB, TypeScript, Tailwind CSS, Shadcn/ui

-----

## 4.X Request Limit & Expiry Rules

To prevent spam and ensure fair platform usage, Cargo implements strict request limit and expiry rules for both Instant Booking and Prebooking modes.

### 4.X.1 Instant Booking Request Rules

**Request Limit:**
- **Maximum 10 requests per 5-minute window**
- User can select up to 10 Self Drivers from the search results and send booking requests to all of them simultaneously
- After sending 10 requests, user must wait for responses or expiry before sending new requests

**Expiry Time:**
- **Each request expires in 5 minutes**
- Driver has exactly 5 minutes to accept or reject the request
- If driver does not respond within 5 minutes, request automatically expires

**Request Reset Logic:**
- After 5 minutes, all 10 requests either get accepted, rejected, or expired
- Once the 5-minute window completes, user can immediately send 10 new requests
- No daily limit — user can send unlimited batches as long as they wait 5 minutes between batches

**Why 5 Minutes?**
- Drivers need reasonable time to read request details
- Prevents instant spam attacks
- Gives drivers flexibility to respond thoughtfully
- Balances speed (instant booking) with fairness

**Example Flow:**
```
10:00 AM → User sends 10 requests to Self Drivers
10:05 AM → All requests expire (if no response)
10:05 AM → User can immediately send 10 new requests
10:10 AM → Next batch expires, and so on...
```

**Edge Cases:**
- If 5 drivers accept and 5 reject within 2 minutes → User can still not send new requests until 5 minutes complete
- If passenger approves one driver at 10:03 AM → Remaining 9 requests auto-cancel, but 5-minute window still applies for new batch
- If user closes app → Requests remain active and expire after 5 minutes

---

### 4.X.2 Prebooking Request Rules

**Request Limit:**
- **Maximum 10 requests per 5-hour window**
- User can select up to 10 Driver+Owner pairs from search results
- After sending 10 requests, user must wait 5 hours before sending new batch

**Expiry Time:**
- **Each request expires 1 day before scheduled trip time**
- If trip is scheduled for March 24th 2:00 PM, requests expire on March 23rd 2:00 PM
- Both Driver and Owner must respond before this deadline

**Request Reset Logic:**
- After 5 hours from sending initial batch, user can send 10 new requests
- This prevents users from spamming multiple prebookings for same time slot
- Users can have maximum 5 active prebookings at any given time

**Why 5 Hours?**
- Prebooking is for planned trips, not urgent needs
- Gives adequate time for Driver and Owner to see and respond
- Prevents abuse where user books multiple vehicles for same trip "just in case"
- Encourages thoughtful selection of Driver+Owner pairs

**Why 1 Day Expiry?**
- Gives Driver and Owner sufficient notice (at least 1 day advance)
- Prevents last-minute chaos
- Ensures both parties have committed at least 24 hours before trip
- Platform can auto-cleanup expired requests efficiently

**Example Flow:**
```
Day 1, 10:00 AM → User sends 10 prebooking requests for trip on Day 3, 2:00 PM
Day 1, 3:00 PM  → User cannot send new requests (5-hour window active)
Day 2, 2:00 PM  → All requests auto-expire (1 day before scheduled trip)
Day 2, 3:00 PM  → User can send 10 new requests (5-hour window completed)
```

**Edge Cases:**
- If both Driver and Owner accept within 1 hour → User still cannot send new batch until 5 hours complete
- If user cancels approved prebooking → 1-hour penalty applied before next prebooking allowed
- If trip scheduled for less than 1 day in future → Prebooking not allowed (must use Instant Booking)

---

### 4.X.3 Anti-Spam Protection

**Problem Scenario:**
A malicious user could theoretically:
1. Send 10 instant requests every 5 minutes → 120 requests/hour
2. Send 10 prebooking requests every 5 hours → 48 requests/day
3. Never actually book a ride, just waste drivers' time

**Protection Mechanisms:**

**1. Account Reputation Score:**
- New users: Limited to 5 requests per batch initially
- After 3 successful completed trips: Upgraded to 10 requests per batch
- Users with high rejection rate (>80%) → Flagged for review

**2. Rate Limiting:**
- API endpoint `/api/booking-request/create` has rate limit: 1 request per second
- Prevents automated bot attacks
- Enforced at server level using Redis

**3. Penalty System:**
- If user sends 3 consecutive batches with 100% rejection → 30-minute cooldown
- If user cancels after driver accepts (instant) → Warning issued
- 5 warnings → Account review by admin

**4. Fair Usage Monitoring:**
- Platform tracks: Request sent / Trips completed ratio
- Healthy ratio: < 5:1 (sent 50 requests, completed 10 trips)
- Suspicious ratio: > 20:1 → Account flagged

---

### 4.X.4 Implementation Architecture

**Database Schema Addition:**
```javascript
// User collection — new fields
{
  requestLimits: {
    instant: {
      lastBatchSentAt: Date,
      requestsInCurrentBatch: Number,
      nextBatchAllowedAt: Date
    },
    prebooking: {
      lastBatchSentAt: Date,
      requestsInCurrentBatch: Number,
      nextBatchAllowedAt: Date,
      activeBookingsCount: Number
    }
  },
  reputation: {
    totalRequestsSent: Number,
    totalTripsCompleted: Number,
    rejectionRate: Number,
    warningCount: Number,
    penaltyEndsAt: Date
  }
}
```

**API Validation Logic:**
```javascript
// Before creating booking request
if (mode === 'instant') {
  const timeSinceLastBatch = now - user.requestLimits.instant.lastBatchSentAt;
  
  if (timeSinceLastBatch < 5 minutes) {
    throw Error("Please wait. You can send next batch after 5 minutes.");
  }
  
  if (user.requestLimits.instant.requestsInCurrentBatch >= 10) {
    throw Error("Maximum 10 requests per batch. Please wait for expiry.");
  }
}

if (mode === 'prebooking') {
  const timeSinceLastBatch = now - user.requestLimits.prebooking.lastBatchSentAt;
  
  if (timeSinceLastBatch < 5 hours) {
    throw Error("Please wait. You can send next batch after 5 hours.");
  }
  
  if (user.requestLimits.prebooking.activeBookingsCount >= 5) {
    throw Error("You already have 5 active prebookings. Complete or cancel one first.");
  }
}
```

**Automatic Cleanup Cron Job:**
```javascript
// Runs every 1 minute
- Check all BookingRequests where status === 'PENDING'
- Instant: If (now - createdAt) > 5 minutes → Set status: 'EXPIRED'
- Prebooking: If now > (scheduledDateTime - 1 day) → Set status: 'EXPIRED'
- Notify passenger about expired requests
- Decrement requestsInCurrentBatch counter
```

---

### 4.X.5 User Experience Impact

**Positive Impacts:**
- Prevents spam and ensures drivers see only serious requests
- Encourages users to be selective and thoughtful
- Reduces notification fatigue for drivers
- Maintains platform quality and trust

**Potential Friction Points:**
- Users might feel restricted by 5-minute / 5-hour windows
- Legitimate users in urgent situations might be limited

**Mitigation:**
- Clear UI messaging: "You can send up to 10 requests. Choose wisely!"
- Show countdown timer: "Next batch available in 3 minutes"
- Provide alternative: "Need urgent ride? Try Instant Booking instead of Prebooking"
- Admin override available for genuine cases

---

### 4.X.6 Future Enhancements

**Dynamic Limits Based on User Tier:**
- Silver users (new): 5 requests per batch
- Gold users (10+ trips): 10 requests per batch  
- Platinum users (50+ trips): 15 requests per batch

**Machine Learning Fraud Detection:**
- Analyze patterns: Time of day, request frequency, acceptance rate
- Auto-flag suspicious accounts for manual review
- Adaptive limits based on user behavior

**Premium Feature:**
- "Priority Requests" for ₹10/request
- Bypasses time windows
- Highlighted to drivers
- Revenue stream for platform

---

*This section ensures Cargo maintains a fair, spam-free, and trustworthy booking ecosystem for all users.*
