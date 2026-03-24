# Request Limit Test Cases

## 4.X.8 Test Cases & Edge Case Verification

### Test Cases Table

| **Test Case ID** | **Scenario** | **Input** | **Expected Output** | **Implementation Status** | **Priority** |
|:---:|---|---|---|---|:---:|
| **INST-001** | Basic Instant Booking Limit | User sends 10 requests | All 10 requests sent, 5-min timer starts | ✅ Implemented | High |
| **INST-002** | Instant Booking Overflow | User tries 11th request in same batch | Error: "Maximum 10 requests per batch" | ✅ Implemented | High |
| **INST-003** | Instant Booking Time Window | User tries new batch after 2 minutes | Error: "Please wait 3 minutes" | ✅ Implemented | High |
| **INST-004** | Instant Booking Window Reset | User waits 5 minutes, sends new batch | New batch of 10 requests allowed | ✅ Implemented | High |
| **INST-005** | Mixed Early Responses | 5 accept, 3 reject in 2 min | Remaining 2 requests still active until 5 min | ✅ Implemented | Medium |
| **INST-006** | Early Passenger Approval | Passenger approves driver at 2 min | Other 9 requests auto-cancel, 5-min window continues | ✅ Implemented | Medium |
| **INST-007** | All Requests Expire | No driver responds in 5 minutes | All requests set to EXPIRED, user can send new batch | ✅ Implemented | High |
| **INST-008** | App Close & Reopen | User closes app after sending requests | Requests remain active, expire after 5 minutes | ✅ Implemented | Medium |
| **PREB-001** | Basic Prebooking Limit | User sends 10 prebooking requests | All 10 requests sent, 5-hour timer starts | ✅ Implemented | High |
| **PREB-002** | Prebooking Overflow | User tries 11th prebooking request | Error: "Maximum 10 requests per batch" | ✅ Implemented | High |
| **PREB-003** | Prebooking Time Window | User tries new batch after 2 hours | Error: "Please wait 3 hours" | ✅ Implemented | High |
| **PREB-004** | Prebooking Window Reset | User waits 5 hours, sends new batch | New batch of 10 requests allowed | ✅ Implemented | High |
| **PREB-005** | Active Booking Limit | User has 5 active prebookings | Error: "Maximum 5 active prebookings allowed" | ✅ Implemented | High |
| **PREB-006** | Quick Acceptance | Driver+Owner accept in 1 hour | Prebooking active, 5-hour window continues | ✅ Implemented | Medium |
| **PREB-007** | Prebooking Expiry | Trip scheduled in 24 hours | Requests expire 1 day before trip time | ✅ Implemented | High |
| **PREB-008** | Last-minute Booking | User tries to book for same day | Error: "Prebooking requires 24 hours advance notice" | ✅ Implemented | Medium |
| **PREB-009** | Cancel After Approval | User cancels approved prebooking | 1-hour penalty before next prebooking | 🔄 In Progress | Medium |
| **ANTI-001** | New User Limit | New user sends 6 requests | Only 5 requests allowed, error on 6th | 📋 Planned | Medium |
| **ANTI-002** | Rate Limiting | Bot sends 2 requests in 1 second | Second request blocked: "Too many requests" | ✅ Implemented | High |
| **ANTI-003** | High Rejection Rate | User has 85% rejection rate | Account flagged for admin review | 📋 Planned | Medium |
| **ANTI-004** | Consecutive Rejections | 3 batches with 100% rejection | 30-minute cooldown applied | 📋 Planned | Medium |
| **ANTI-005** | Fair Usage Ratio | User has 25:1 request:trip ratio | Account auto-flagged as suspicious | 📋 Planned | Low |
| **ANTI-006** | Warning System | User cancels after driver accepts | Warning issued, 5 warnings = review | 📋 Planned | Low |

### Edge Case Scenarios Detailed

#### INST-005: Mixed Early Responses
```
Scenario: User sends 10 requests at 10:00 AM
Expected Timeline:
10:00 AM - 10 requests sent to drivers
10:01 AM - Driver A accepts
10:01 AM - Driver B rejects  
10:02 AM - Driver C accepts
10:05 AM - Remaining 7 requests auto-expire
Result: User has 2 accepted requests, must choose one
```

#### INST-006: Early Passenger Approval
```
Scenario: User sends 10 requests at 10:00 AM
Timeline:
10:00 AM - 10 requests sent
10:03 AM - Passenger approves Driver A
10:03 AM - System auto-cancels 9 pending requests
10:05 AM - 5-minute window completes
10:05 AM - User can send new batch (not 10:03 AM)
```

#### PREB-006: Quick Acceptance
```
Scenario: Prebooking for March 24, 2:00 PM
Timeline:
Day 1, 10:00 AM - 10 requests sent
Day 1, 11:00 AM - Driver+Owner Pair A both accept
Day 1, 3:00 PM - 5-hour window still active
Day 2, 2:00 PM - 1-day expiry timer starts
Day 3, 2:00 PM - Trip time (if confirmed)
```

#### ANTI-003: High Rejection Rate
```
Scenario: User behavior pattern
Batch 1: 10 requests, 0 accepted (0% success)
Batch 2: 10 requests, 1 accepted (10% success)  
Batch 3: 10 requests, 0 accepted (0% success)
Overall: 30 requests, 1 accepted (96.7% rejection)
Expected: Account flagged for admin review
```

### Integration Test Scenarios

| **Scenario** | **Description** | **Test Steps** | **Expected Result** |
|:---|---|---|---|
| **INT-001** | Instant to Prebooking Switch | User sends instant requests, then tries prebooking | Instant 5-min timer doesn't affect prebooking 5-hour timer |
| **INT-002** | Multiple User Concurrent | 10 users send requests simultaneously | Each user's limits tracked independently |
| **INT-003** | System Restart | Server restarts with active requests | All timers and counters preserved |
| **INT-004** | Database Failure | MongoDB temporarily unavailable | Graceful error handling, no data corruption |
| **INT-005** | Cron Job Failure | Auto-expiry cron job stops | Manual cleanup option, admin notifications |

### Performance Test Cases

| **Test Case** | **Load** | **Expected Performance** | **Current Status** |
|:---|---|---|---|
| **PERF-001** | 1000 concurrent requests | API response < 500ms | ✅ Tested |
| **PERF-002** | 10,000 user limit checks | Rate limiting < 50ms | ✅ Tested |
| **PERF-003** | Cron job processing | 1M requests processed in < 5 min | 📋 Planned |
| **PERF-004** | Database query optimization | User lookup < 10ms | ✅ Tested |

### Security Test Cases

| **Security Test** | **Threat** | **Mitigation** | **Status** |
|:---|---|---|---|
| **SEC-001** | Bot attack - rapid requests | Rate limiting: 1 req/sec | ✅ Implemented |
| **SEC-002** | Multiple accounts | IP tracking + device fingerprint | 📋 Planned |
| **SEC-003** | Request manipulation | Server-side validation | ✅ Implemented |
| **SEC-004** | Timer bypass | Server-controlled timers | ✅ Implemented |

### User Acceptance Test (UAT) Scenarios

| **UAT ID** | **User Story** | **Acceptance Criteria** | **Status** |
|:---|---|---|---|
| **UAT-001** | New user sends first requests | Limited to 5 requests, clear error messages | 📋 Planned |
| **UAT-002** | Regular user sends requests | Full 10 requests allowed, timer shown | ✅ Ready |
| **UAT-003** | User waits for expiry | Can send new batch immediately after expiry | ✅ Ready |
| **UAT-004** | User gets rejected | System continues working, no penalties | ✅ Ready |
| **UAT-005** | User cancels trip | Appropriate penalties applied | 🔄 In Progress |

### Regression Test Checklist

- [ ] **INST-001**: Basic instant booking limit still works
- [ ] **PREB-001**: Basic prebooking limit still works  
- [ ] **ANTI-001**: Rate limiting still effective
- [ ] **PERF-001**: Performance under load maintained
- [ ] **SEC-001**: Security measures still functional
- [ ] **UI-001**: Error messages display correctly
- [ ] **UI-002**: Countdown timers update in real-time
- [ ] **DB-001**: Database schema updates don't break existing data
- [ ] **API-001**: All API endpoints still respond correctly
- [ ] **CRON-001**: Automatic expiry still works

### Test Environment Setup

```javascript
// Test Configuration
const testConfig = {
  instantBooking: {
    maxRequests: 10,
    windowMinutes: 5,
    expiryMinutes: 5
  },
  prebooking: {
    maxRequests: 10,
    windowHours: 5,
    expiryHoursBeforeTrip: 24,
    maxActiveBookings: 5
  },
  antiSpam: {
    rateLimitPerSecond: 1,
    newUserMaxRequests: 5,
    highRejectionThreshold: 0.8,
    suspiciousRatio: 20
  }
};
```

### Mock Data for Testing

```javascript
// Test Users
const testUsers = {
  newUser: {
    completedTrips: 0,
    totalRequests: 0,
    reputation: 'NEW'
  },
  regularUser: {
    completedTrips: 5,
    totalRequests: 25,
    reputation: 'REGULAR'
  },
  suspiciousUser: {
    completedTrips: 1,
    totalRequests: 30,
    rejectionRate: 0.97
  }
};
```

---

*This comprehensive test suite ensures all request limit rules work correctly across all scenarios and edge cases.*
