# Request Limit Flow Diagrams

## 4.X.7 Request Limit Flow Diagrams

### Instant Booking Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    INSTANT BOOKING FLOW                          │
└─────────────────────────────────────────────────────────────────┘

User clicks "Send Request" on Self Driver cards
                      │
                      ▼
            ┌─────────────────────┐
            │  API Validation     │
            │  Check Limits       │
            └─────────────────────┘
                      │
                      ▼
    ┌───────────────────────────────────────────────┐
    │  Has user sent 10 requests in last 5 min?    │
    └───────────────────────────────────────────────┘
                      │
            YES         │         NO
            │           ▼           ▼
            │    ┌─────────────┐ ┌─────────────┐
            │    │  SHOW ERROR │ │  CONTINUE   │
            │    │ "Wait X min"│ │  TO CREATE  │
            │    └─────────────┘ │  REQUESTS   │
            │           │         └─────────────┘
            │           ▼                   │
            │    ┌─────────────┐           │
            │    │  USER MUST  │           │
            │    │   WAIT      │           ▼
            │    └─────────────┘    ┌─────────────┐
            │                      │ CREATE BATCH │
            │                      │ (Max 10)     │
            │                      └─────────────┘
            │                              │
            │                              ▼
            │                      ┌─────────────┐
            │                      │ UPDATE USER │
            │                      │ BATCH INFO │
            │                      └─────────────┘
            │                              │
            │                              ▼
            │                      ┌─────────────┐
            │                      │ SEND TO 10  │
            │                      │ DRIVERS     │
            │                      └─────────────┘
            │                              │
            │                              ▼
            │                      ┌─────────────┐
            │                      │ START 5-MIN │
            │                      │   TIMER     │
            │                      └─────────────┘
            │                              │
            ▼                              ▼
    ┌─────────────────────┐    ┌─────────────────────┐
    │  DRIVER RESPONSES   │    │   5-MIN TIMER ENDS  │
    │  (Accept/Reject)    │    │                     │
    └─────────────────────┘    │  All requests:      │
              │                  │  - Accepted        │
              │                  │  - Rejected        │
              │                  │  - Expired         │
              │                  │                     │
              ▼                  │  RESET BATCH COUNTER│
    ┌─────────────────────┐    │  USER CAN SEND      │
    │  PASSENGER APPROVES │    │  NEW BATCH NOW      │
    │  ONE DRIVER         │    └─────────────────────┘
    └─────────────────────┘              │
              │                            ▼
              ▼                    ┌─────────────────────┐
    ┌─────────────────────┐      │   FLOW RESTARTS    │
    │  AUTO-CANCEL OTHER  │      │   (User can send   │
    │  9 PENDING REQUESTS │      │    10 new requests)│
    └─────────────────────┘      └─────────────────────┘
```

### Prebooking Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     PREBOOKING FLOW                              │
└─────────────────────────────────────────────────────────────────┘

User clicks "Send Request" on Driver+Owner pairs
                      │
                      ▼
            ┌─────────────────────┐
            │  API Validation     │
            │  Check Limits       │
            └─────────────────────┘
                      │
                      ▼
    ┌───────────────────────────────────────────────┐
    │  Has user sent 10 requests in last 5 hours?  │
    └───────────────────────────────────────────────┘
                      │
            YES         │         NO
            │           ▼           ▼
            │    ┌─────────────┐ ┌─────────────┐
            │    │  SHOW ERROR │ │  CONTINUE   │
            │    │ "Wait X hrs"│ │  TO CREATE  │
            │    └─────────────┘ │  REQUESTS   │
            │           │         └─────────────┘
            │           ▼                   │
            │    ┌─────────────┐           │
            │    │  USER MUST  │           │
            │    │   WAIT      │           ▼
            │    └─────────────┐    ┌─────────────┐
            │                      │ CREATE BATCH │
            │                      │ (Max 10)     │
            │                      └─────────────┘
            │                              │
            │                              ▼
            │                      ┌─────────────┐
            │                      │ UPDATE USER │
            │                      │ BATCH INFO │
            │                      └─────────────┘
            │                              │
            │                              ▼
            │                      ┌─────────────┐
            │                      │ SEND TO 10  │
            │                      │ DRIVER+OWNER │
            │                      │    PAIRS     │
            │                      └─────────────┘
            │                              │
            │                              ▼
            │                      ┌─────────────┐
            │                      │ START 5-HR  │
            │                      │   TIMER     │
            │                      └─────────────┘
            │                              │
            ▼                              ▼
    ┌─────────────────────┐    ┌─────────────────────┐
    │  DRIVER+OWNER       │    │   5-HOUR TIMER ENDS │
    │  RESPONSES           │    │                     │
    │  (Both must accept) │    │  User can send      │
    └─────────────────────┘    │  10 new requests     │
              │                  └─────────────────────┘
              │                            │
              ▼                            ▼
    ┌─────────────────────┐      ┌─────────────────────┐
    │  BOTH ACCEPT?       │      │   FLOW RESTARTS    │
    └─────────────────────┘      │   (User can send   │
              │                  │    10 new requests)│
        YES │   NO               └─────────────────────┘
              ▼       │
    ┌─────────────────────┐   │
    │  PREBOOKING ACTIVE │   │
    │  (Counts towards   │   │
    │   5-booking limit) │   │
    └─────────────────────┘   │
              │               │
              ▼               ▼
    ┌─────────────────────┐   │
    │  1-DAY BEFORE TRIP  │   │
    │  EXPIRY TIMER STARTS│   │
    └─────────────────────┘   │
              │               │
              ▼               │
    ┌─────────────────────┐   │
    │  24H BEFORE TRIP    │   │
    │  AUTO-EXPIRE        │   │
    │  IF NOT CONFIRMED   │   │
    └─────────────────────┘   │
              │               │
              ▼               ▼
    ┌─────────────────────┐   │
    │  NOTIFY ALL PARTIES │   │
    │  (Passenger, Driver,│   │
    │   Owner)             │   │
    └─────────────────────┘   │
                              │
                              ▼
                    ┌─────────────────────┐
                    │  DECREMENT BATCH    │
                    │  COUNTER            │
                    └─────────────────────┘
```

### Anti-Spam Protection Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   ANTI-SPAM PROTECTION FLOW                     │
└─────────────────────────────────────────────────────────────────┘

User tries to send booking request
                │
                ▼
    ┌─────────────────────────┐
    │  ACCOUNT REPUTATION    │
    │  CHECK                 │
    └─────────────────────────┘
                │
                ▼
    ┌─────────────────────────────────────────────┐
    │  IS USER NEW (< 3 completed trips)?         │
    └─────────────────────────────────────────────┘
                │
        YES       │       NO
        │         ▼         ▼
        │   ┌─────────────┐ ┌─────────────┐
        │   │  LIMIT TO   │ │  ALLOW FULL │
        │   │  5 REQUESTS │ │  10 REQUESTS │
        │   └─────────────┘ └─────────────┘
        │         │               │
        │         ▼               ▼
        │         └───────────────┘
        │                         │
        ▼                         ▼
┌─────────────────┐    ┌─────────────────┐
│  RATE LIMIT     │    │  RATE LIMIT     │
│  CHECK (1/sec)  │    │  CHECK (1/sec)  │
└─────────────────┘    └─────────────────┘
        │                         │
        ▼                         ▼
┌─────────────────┐    ┌─────────────────┐
│  REJECTION RATE │    │  REJECTION RATE │
│  MONITORING     │    │  MONITORING     │
└─────────────────┘    └─────────────────┘
        │                         │
        ▼                         ▼
┌─────────────────────────────────────────────┐
│  IS REJECTION RATE > 80%?                  │
└─────────────────────────────────────────────┘
                │
        YES       │       NO
        │         ▼         ▼
        │   ┌─────────────┐ ┌─────────────┐
        │   │  FLAG FOR   │ │  ALLOW      │
        │   │  ADMIN REVIEW│ │  REQUESTS   │
        │   └─────────────┘ └─────────────┘
        │         │               │
        ▼         ▼               ▼
┌─────────────────┐    ┌─────────────────┐
│  PENALTY SYSTEM │    │  PENALTY SYSTEM │
│  CHECK          │    │  CHECK          │
└─────────────────┘    └─────────────────┘
        │                         │
        ▼                         ▼
┌─────────────────────────────────────────────┐
│  3 CONSECUTIVE 100% REJECTION BATCHES?      │
└─────────────────────────────────────────────┘
                │
        YES       │       NO
        │         ▼         ▼
        │   ┌─────────────┐ ┌─────────────┐
        │   │  APPLY 30   │ │  NO PENALTY │
        │   │  MIN COOLDOWN│ │  APPLIED    │
        │   └─────────────┘ └─────────────┘
        │         │               │
        ▼         ▼               ▼
┌─────────────────┐    ┌─────────────────┐
│  FAIR USAGE     │    │  FAIR USAGE     │
│  RATIO CHECK    │    │  RATIO CHECK    │
│  (Requests:Trips)│   │  (Requests:Trips)│
└─────────────────┘    └─────────────────┘
        │                         │
        ▼                         ▼
┌─────────────────────────────────────────────┐
│  IS RATIO > 20:1?                           │
│  (Suspicious activity)                      │
└─────────────────────────────────────────────┘
                │
        YES       │       NO
        │         ▼         ▼
        │   ┌─────────────┐ ┌─────────────┐
        │   │  AUTO FLAG  │ │  ALLOW      │
        │   │  ACCOUNT     │ │  REQUESTS   │
        │   └─────────────┘ └─────────────┘
        │         │               │
        ▼         ▼               ▼
    ┌───────────┐         ┌───────────┐
    │  ADMIN    │         │  PROCEED  │
    │  REVIEW   │         │  WITH     │
    │  REQUIRED │         │  REQUEST   │
    └───────────┘         └───────────┘
```

---

*These flow diagrams illustrate the complete request limit lifecycle for both booking modes and the anti-spam protection mechanisms.*
