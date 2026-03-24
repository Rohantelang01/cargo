# Setup Instructions for RideShareX

## Issues Found:
1. **Google Fonts Connection Issue** - ✅ Fixed by removing Inter font dependency
2. **MongoDB Connection Timeout** - Network connectivity issue with cargo.h80okhw.mongodb.net

## Solutions:

### 1. MongoDB Connection Fix

The MongoDB connection is failing due to network issues. Try these solutions:

#### Option A: Check Network Connection
```bash
# Test if you can reach MongoDB
ping cargo.h80okhw.mongodb.net
```

#### Option B: Use Local MongoDB (Recommended for Development)
1. Install MongoDB locally:
   - Download from https://www.mongodb.com/try/download/community
   - Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo`

2. Update your `.env.local` file:
```
MONGODB_URI="mongodb://localhost:27017/cargo"
JWT_SECRET="your-super-secret-key-change-it-later"
```

#### Option C: Check Firewall/VPN
- Disable VPN temporarily
- Check if firewall is blocking MongoDB connections
- Try different network

### 2. Google Fonts Fix - ✅ Already Fixed
- Removed Inter font dependency from `app/layout.tsx`
- Now using system fonts (`font-sans` class)

### 3. Restart Development Server
```bash
npm run dev
```

## Testing the Fix
1. After updating `.env.local`, restart the server
2. Navigate to http://localhost:3000
3. Try login functionality

## If Issues Persist
Check these files:
- `.env.local` - Ensure MongoDB URI is correct
- Network connectivity - Can you reach MongoDB Atlas?
- MongoDB Atlas access - Is your IP whitelisted?
