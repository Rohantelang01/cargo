import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import mongoose from 'mongoose';
import { User } from '../models/User';
import { Vehicle } from '../models/Vehicle';
import { Wallet } from '../models/Wallet';
import { Booking } from '../models/Booking';
import { BookingRequest } from '../models/BookingRequest';
import { Trip } from '../models/Trip';
import { Review } from '../models/Review';
import { Notification } from '../models/Notification';
import connectToDB from '../lib/db';

// ══════════════════════════════════════════════════════════════
// LOCATIONS — Chandrapur + Yavatmal Districts, Maharashtra
// ══════════════════════════════════════════════════════════════

const locations = [
  // ── Chandrapur District ──
  { place: 'Chandrapur',  tehsil: 'Chandrapur', district: 'Chandrapur', pincode: '442401', lat: 19.9500, lng: 79.3000 },
  { place: 'Warora',      tehsil: 'Warora',      district: 'Chandrapur', pincode: '442907', lat: 20.2286, lng: 78.9995 },
  { place: 'Bhadrawati',  tehsil: 'Bhadrawati',  district: 'Chandrapur', pincode: '442902', lat: 20.1032, lng: 79.1308 },
  { place: 'Ballarpur',   tehsil: 'Ballarpur',   district: 'Chandrapur', pincode: '442701', lat: 19.8398, lng: 79.3554 },
  { place: 'Rajura',      tehsil: 'Rajura',      district: 'Chandrapur', pincode: '442905', lat: 19.7786, lng: 79.3648 },
  { place: 'Mul',         tehsil: 'Mul',         district: 'Chandrapur', pincode: '441224', lat: 20.0697, lng: 79.6736 },
  { place: 'Gondpipri',   tehsil: 'Gondpipri',   district: 'Chandrapur', pincode: '442702', lat: 19.9344, lng: 79.8033 },
  { place: 'Pombhurna',   tehsil: 'Pombhurna',   district: 'Chandrapur', pincode: '441225', lat: 20.1486, lng: 79.7909 },
  { place: 'Korpana',     tehsil: 'Korpana',     district: 'Chandrapur', pincode: '442916', lat: 19.7025, lng: 79.1911 },
  { place: 'Nagbhir',     tehsil: 'Nagbhir',     district: 'Chandrapur', pincode: '441205', lat: 20.5595, lng: 79.8016 },
  { place: 'Sindewahi',   tehsil: 'Sindewahi',   district: 'Chandrapur', pincode: '441222', lat: 20.3683, lng: 79.6587 },
  { place: 'Brahmapuri',  tehsil: 'Brahmapuri',  district: 'Chandrapur', pincode: '441206', lat: 20.6276, lng: 79.8561 },
  { place: 'Chimur',      tehsil: 'Chimur',      district: 'Chandrapur', pincode: '442903', lat: 20.4859, lng: 79.3582 },
  { place: 'Sawali',      tehsil: 'Sawali',      district: 'Chandrapur', pincode: '441225', lat: 20.2199, lng: 79.7171 },
  { place: 'Anandwan',    tehsil: 'Warora',      district: 'Chandrapur', pincode: '442914', lat: 20.2054, lng: 78.9752 },
  { place: 'Ghugus',      tehsil: 'Chandrapur',  district: 'Chandrapur', pincode: '442505', lat: 19.9338, lng: 79.1265 },
  { place: 'Jiwati',      tehsil: 'Jiwati',      district: 'Chandrapur', pincode: '442406', lat: 19.5800, lng: 79.0800 },
  { place: 'Borgaon',     tehsil: 'Bhadrawati',  district: 'Chandrapur', pincode: '442902', lat: 20.0900, lng: 79.1500 },
  { place: 'Neri',        tehsil: 'Brahmapuri',  district: 'Chandrapur', pincode: '441206', lat: 20.6000, lng: 79.9000 },
  { place: 'Vichoda',     tehsil: 'Chimur',      district: 'Chandrapur', pincode: '442903', lat: 20.4500, lng: 79.4000 },
  // ── Yavatmal District ──
  { place: 'Yavatmal',    tehsil: 'Yavatmal',    district: 'Yavatmal',   pincode: '445001', lat: 20.4000, lng: 78.1200 },
  { place: 'Wani',        tehsil: 'Wani',        district: 'Yavatmal',   pincode: '445304', lat: 20.0632, lng: 78.9484 },
  { place: 'Pusad',       tehsil: 'Pusad',       district: 'Yavatmal',   pincode: '445204', lat: 19.9000, lng: 77.5700 },
  { place: 'Umarkhed',    tehsil: 'Umarkhed',    district: 'Yavatmal',   pincode: '445206', lat: 19.6000, lng: 77.6900 },
  { place: 'Digras',      tehsil: 'Digras',      district: 'Yavatmal',   pincode: '445203', lat: 20.1000, lng: 77.7200 },
  { place: 'Darwha',      tehsil: 'Darwha',      district: 'Yavatmal',   pincode: '445202', lat: 20.3100, lng: 77.7700 },
  { place: 'Arni',        tehsil: 'Arni',        district: 'Yavatmal',   pincode: '445103', lat: 20.5400, lng: 78.0800 },
  { place: 'Kalamb',      tehsil: 'Kalamb',      district: 'Yavatmal',   pincode: '445401', lat: 20.2600, lng: 78.1200 },
  { place: 'Ner',         tehsil: 'Ner',         district: 'Yavatmal',   pincode: '445102', lat: 20.4400, lng: 77.9200 },
  { place: 'Mahagaon',    tehsil: 'Mahagaon',    district: 'Yavatmal',   pincode: '445302', lat: 20.0200, lng: 78.3500 },
  { place: 'Ralegaon',    tehsil: 'Ralegaon',    district: 'Yavatmal',   pincode: '445402', lat: 20.6700, lng: 78.0900 },
  { place: 'Ghatanji',    tehsil: 'Ghatanji',    district: 'Yavatmal',   pincode: '445301', lat: 20.1400, lng: 78.3200 },
  { place: 'Kelapur',     tehsil: 'Kelapur',     district: 'Yavatmal',   pincode: '445303', lat: 20.0000, lng: 78.5300 },
  { place: 'Maregaon',    tehsil: 'Maregaon',    district: 'Yavatmal',   pincode: '445306', lat: 20.3100, lng: 78.6900 },
  { place: 'ZariJamani',  tehsil: 'Zari Jamani', district: 'Yavatmal',   pincode: '445305', lat: 20.5600, lng: 78.5800 },
  { place: 'Babulgaon',   tehsil: 'Babulgaon',   district: 'Yavatmal',   pincode: '445101', lat: 20.1700, lng: 77.9700 },
];

// ══════════════════════════════════════════════════════════════
// NAME POOLS (Maharashtrian names)
// ══════════════════════════════════════════════════════════════

const firstNames = [
  'Rohan','Aditya','Ayush','Priya','Meena','Suresh','Vijay','Rahul','Amit','Neha',
  'Ganesh','Deepak','Santosh','Vicky','Sneha','Pooja','Kiran','Raju','Anil','Sunil',
  'Mahesh','Dinesh','Kunal','Pratik','Sagar','Swati','Anjali','Ramesh','Sanjay','Manoj',
  'Rajesh','Manish','Sunita','Kavita','Sachin','Nitin','Vishal','Vikram','Prakash','Ashok',
  'Rani','Geeta','Nilesh','Pramod','Prashant','Vaibhav','Shubham','Akash','Gauri','Sonali',
  'Tushar','Omkar','Yash','Pallavi','Shruti','Dipali','Rekha','Vidya','Chetan','Rohit',
];
const lastNames = [
  'Rathod','Khaire','Kambale','Deshmukh','Patil','Kulkarni','Shinde','Pawar','More','Joshi',
  'Kale','Wagh','Thakre','Kadam','Jadhav','Bhosale','Chavan','Munde','Gite','Mahajan',
  'Pande','Wankhede','Mhatre','Gaikwad','Tekam','Nagpure','Bapat','Khandekar','Shirke','Mane',
  'Tawde','Sawant','Gokhale','Bhagat','Raut','Chaudhari','Mali','Sutar','Kumare','Atram',
  'Bonde','Fulzele','Gedam','Hiwrale','Ikhar','Junghare','Kohale','Lambat','Meshram','Nandanwar',
];

// ══════════════════════════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════════════════════════

let _ni = 0, _pi = 7000000, _plIdx = 1000, _liIdx = 1000;

const uName  = () => { const n = `${firstNames[_ni % firstNames.length]} ${lastNames[Math.floor(_ni / firstNames.length) % lastNames.length]}`; _ni++; return n; };
const uPhone = (pfx: string) => `${pfx}${String(_pi++).padStart(7,'0')}`;
const uPlate = () => `MH34AB${String(_plIdx++).padStart(4,'0')}`;
const uLic   = (code: string) => `MH34${code}2024${String(_liIdx++).padStart(5,'0')}`;

const rI  = (a: number, b: number) => Math.floor(Math.random()*(b-a+1))+a;
const rF  = (a: number, b: number) => parseFloat((Math.random()*(b-a)+a).toFixed(2));
const rEl = <T>(arr: T[]): T => arr[rI(0,arr.length-1)];
const L   = (i: number) => locations[i % locations.length];

const mkAddr = (l: typeof locations[0]) => ({
  addressLine1: `Main Road, ${l.place}`, village: l.place, tehsil: l.tehsil,
  district: l.district, state: 'Maharashtra', pincode: l.pincode,
  coordinates: { lat: l.lat, lng: l.lng },
});
const mkGeo = (l: typeof locations[0]) => ({
  type: 'Point' as const,
  coordinates: [l.lng + rF(-0.01,0.01), l.lat + rF(-0.01,0.01)] as [number,number],
});
const mkLoc = (l: typeof locations[0]) => ({
  address: `${l.place}, ${l.district}, Maharashtra`,
  coordinates: { lat: l.lat + rF(-0.005,0.005), lng: l.lng + rF(-0.005,0.005) },
});
const IMG = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';

// ══════════════════════════════════════════════════════════════
// VEHICLE TYPE CONFIG
// ══════════════════════════════════════════════════════════════

const VC = {
  bike:  { lic:'MCG',   seats:2,  kmR:[4,5,6],    hrR:[50,60,70],    makes:['Hero','Honda','Bajaj','TVS','Yamaha'],      models:['Splendor','CB Shine','Pulsar','Apache','FZ']       },
  auto:  { lic:'3W-T',  seats:3,  kmR:[10,11,12], hrR:[70,80,90],    makes:['Bajaj','Piaggio','Mahindra'],               models:['RE Compact','Ape City','Alfa']                     },
  car:   { lic:'LMV',   seats:5,  kmR:[12,14,15], hrR:[90,100,110],  makes:['Maruti','Hyundai','Tata','Mahindra'],       models:['Swift','i20','Nexon','Bolero']                     },
  truck: { lic:'HGV',   seats:2,  kmR:[20,22,25], hrR:[150,180,200], makes:['Tata','Ashok Leyland','Eicher'],            models:['Ace','407','Pro 3015','Pickup']                    },
  bus:   { lic:'HPMV',  seats:20, kmR:[18,20,22], hrR:[200,220,250], makes:['Tata','Ashok Leyland','Force'],             models:['Starbus','Viking','Traveller']                     },
} as const;
type VT = keyof typeof VC;

// ══════════════════════════════════════════════════════════════
// CORE HELPERS
// ══════════════════════════════════════════════════════════════

// IMPORTANT: Always new User() + .save() to trigger bcrypt middleware
// NEVER use insertMany() — it skips pre-save hooks, passwords stay plain text
const mkUser = async (data: any, addBal = 1500, genBal = 0) => {
  const u = new User({ ...data, password: 'password123' });
  const s = await u.save();
  const w = new Wallet({ user: s._id, addedBalance: addBal, generatedBalance: genBal, rentalBalance: 0, transactions: [] });
  await w.save();
  s.wallet = w._id;
  await s.save();
  return s;
};

const mkVehicle = async (ownerId: any, driverId: any | null, selfDriven: boolean, vt: VT, status: 'OFFLINE'|'AVAILABLE'|'ON_TRIP', locIdx: number) => {
  const c = VC[vt];
  return Vehicle.create({
    owner: ownerId, assignedDriver: driverId || undefined, selfDriven,
    make: rEl([...c.makes]), model: rEl([...c.models]),
    year: rI(2016,2023), color: rEl(['White','Silver','Black','Red','Blue','Grey']),
    plateNumber: uPlate(), vehicleType: vt, requiredLicense: c.lic,
    seatingCapacity: c.seats, perKmRate: rEl([...c.kmR]),
    status, rcDocument: IMG, insurance: IMG,
    currentLocation: mkGeo(L(locIdx)),
    rating: rF(3.5,5.0), totalTrips: rI(5,80),
  });
};

const mkFare = (dHr: number, vKm: number, lic: string, estH: number, estKm: number, isCombo: boolean) => {
  const dE = Math.round(dHr * estH);
  const oE = Math.round(vKm * estKm);
  const pf = Math.round(1 * estKm); // Rs.1 per km platform fee
  return {
    driverHourlyRate: dHr, vehiclePerKmRate: vKm, licenseUsed: lic,
    estimatedDuration: estH, estimatedDistance: estKm,
    driverEarning: dE, ownerEarning: oE,
    platformFeePerKm: 1, platformFee: pf,
    estimatedFare: dE + oE + pf,
    isComboTrip: isCombo,
  };
};

// ══════════════════════════════════════════════════════════════
// MAIN SEED
// ══════════════════════════════════════════════════════════════

const seed = async () => {
  await connectToDB();
  console.log('\n🔌 Connected. Clearing old data...');

  await Trip.deleteMany({});
  await Review.deleteMany({});
  await Notification.deleteMany({});
  await BookingRequest.deleteMany({});
  await Booking.deleteMany({});
  await Wallet.deleteMany({});
  await Vehicle.deleteMany({});
  await User.deleteMany({});

  console.log('🧹 Cleared.\n');
  const notifs: any[] = [];
  const addN = (userId: any, type: string, title: string, msg: string, bId?: any) =>
    notifs.push({ userId, type, title, message: msg, isRead: false, relatedBookingId: bId });

  // ─────────────────────────────────────────────────────────
  // ADMIN
  // ─────────────────────────────────────────────────────────
  await mkUser({ name:'Admin Cargo', email:'admin@cargo.com', phone:'9999999999', age:35, gender:'male', roles:['admin'], status:'ONLINE', permanentAddress:mkAddr(L(0)), currentLocation:mkGeo(L(0)) }, 0, 0);
  console.log('✅ Admin');

  // ─────────────────────────────────────────────────────────
  // PASSENGERS — 20
  // ─────────────────────────────────────────────────────────
  const P: any[] = [];
  for (let i = 0; i < 20; i++) {
    const l = L(i);
    P.push(await mkUser({
      name: uName(), email:`passenger${i}@cargo.com`, phone:uPhone('70'),
      age:rI(18,55), gender: i%3===0 ? 'female':'male',
      roles:['passenger'], status: i<16 ? 'ONLINE':'OFFLINE',
      permanentAddress:mkAddr(l), currentLocation:mkGeo(l),
      publicInfo:{ rating:rF(3.5,5), totalTrips:rI(2,30), memberSince:new Date(Date.now()-rI(30,500)*86400000) },
    }, rI(1000,8000), 0));
  }
  console.log(`✅ Passengers: ${P.length}`);

  // ─────────────────────────────────────────────────────────
  // PURE DRIVERS — 25
  // driverStatuses: 10 AVAILABLE, 5 ON_TRIP, 3 SCHEDULED, 3 UNAVAILABLE, 4 OFFLINE
  // ─────────────────────────────────────────────────────────
  const D: any[] = [];
  const dStats  = ['AVAILABLE','AVAILABLE','AVAILABLE','AVAILABLE','AVAILABLE','AVAILABLE','AVAILABLE','AVAILABLE','AVAILABLE','AVAILABLE','ON_TRIP','ON_TRIP','ON_TRIP','ON_TRIP','ON_TRIP','SCHEDULED','SCHEDULED','SCHEDULED','UNAVAILABLE','UNAVAILABLE','UNAVAILABLE','OFFLINE','OFFLINE','OFFLINE','OFFLINE'];
  const dVTypes: VT[] = ['bike','bike','bike','bike','bike','car','car','car','car','car','truck','truck','truck','auto','auto','bike','car','truck','auto','bike','car','car','bike','truck','auto'];

  for (let i = 0; i < 25; i++) {
    const l   = L(i+2);
    const vt  = dVTypes[i];
    const c   = VC[vt];
    const ds  = dStats[i];
    const us  = ds==='ON_TRIP' ? 'ON_TRIP' : ds==='OFFLINE' ? 'OFFLINE' : 'ONLINE';

    const lics: any[] = [{
      licenseType: c.lic, licenseNumber: uLic(c.lic), licenseImage: IMG,
      vehicleCategory: vt, hourlyRate: rEl([...c.hrR]), isActive: true, isVerified: true,
    }];
    // Multi-license: every 5th driver also has LMV
    if (i % 5 === 0 && vt === 'bike') {
      lics.push({
        licenseType:'LMV', licenseNumber:uLic('LMV'), licenseImage:IMG,
        vehicleCategory:'car', hourlyRate:rEl([...VC.car.hrR]), isActive:true, isVerified:false,
      });
    }

    D.push(await mkUser({
      name:uName(), email:`driver${i}@cargo.com`, phone:uPhone('80'),
      age:rI(22,55), gender:'male', roles:['passenger','driver'], status:us,
      permanentAddress:mkAddr(l), currentLocation:mkGeo(l),
      driverInfo:{ licenses:lics, status:ds, rating:rF(3.5,5), totalTrips:rI(10,150), idProof:IMG },
      publicInfo:{ rating:rF(3.5,5), totalTrips:rI(10,150), memberSince:new Date(Date.now()-rI(60,600)*86400000) },
      // Penalty for last 5 drivers
      ...(i>=20 ? { warnings:rI(1,3), penaltyHistory:[{ type:'WARNING', reason:'Late arrival', timestamp:new Date(Date.now()-rI(1,10)*86400000) }] } : {}),
    }, 500, rI(2000,15000)));
  }
  console.log(`✅ Pure Drivers: ${D.length}`);

  // ─────────────────────────────────────────────────────────
  // PURE OWNERS + VEHICLES — 20 owners
  // ─────────────────────────────────────────────────────────
  const O: any[]  = [];
  const OV: any[] = []; // { owner, vehicle }

  const oVTypes: VT[][] = [
    ['bike'],['car'],['truck'],['auto'],['bike','car'],
    ['car','truck'],['bike','bike'],['car','car'],['truck'],['auto','auto'],
    ['bike'],['car'],['truck'],['auto'],['bike','car'],
    ['car'],['truck'],['bike'],['auto'],['car','truck'],
  ];

  for (let i = 0; i < 20; i++) {
    const l     = L(i+5);
    const oStat = i<14 ? 'ONLINE':'OFFLINE';
    const owner = await mkUser({
      name:uName(), email:`owner${i}@cargo.com`, phone:uPhone('85'),
      age:rI(30,60), gender:i%4===0?'female':'male',
      roles:['passenger','owner'], status:oStat,
      permanentAddress:mkAddr(l), currentLocation:mkGeo(l),
      ownerInfo:{ vehicles:[], rating:rF(3.5,5), totalTrips:rI(20,200) },
      publicInfo:{ rating:rF(3.5,5), totalTrips:rI(20,200), memberSince:new Date(Date.now()-rI(90,700)*86400000) },
    }, 500, rI(5000,25000));

    const vIds: any[] = [];
    for (let j = 0; j < oVTypes[i].length; j++) {
      const vt = oVTypes[i][j];
      const vs: 'OFFLINE'|'AVAILABLE'|'ON_TRIP' =
        oStat==='OFFLINE' ? 'OFFLINE' :
        i<5              ? 'AVAILABLE' :
        i<10             ? (j===0 ? 'ON_TRIP':'AVAILABLE') :
        i<14             ? (j===0 ? 'AVAILABLE':'OFFLINE') : 'OFFLINE';
      const v = await mkVehicle(owner._id, null, false, vt, vs, i+j);
      vIds.push(v._id);
      OV.push({ owner, vehicle:v });
    }
    owner.ownerInfo = { vehicles:vIds, rating:owner.ownerInfo?.rating, totalTrips:owner.ownerInfo?.totalTrips };
    await owner.save();
    O.push(owner);
  }
  console.log(`✅ Owners: ${O.length}, Owner-Vehicles: ${OV.length}`);

  // ─────────────────────────────────────────────────────────
  // SELF DRIVERS — 25
  // statuses: 10 ONLINE, 5 ON_TRIP, 3 SCHEDULED, 3 OFFLINE, 4 ONLINE
  // ─────────────────────────────────────────────────────────
  const SD: any[] = []; // { user, vehicle }
  const sdVT: VT[]       = ['car','bike','auto','truck','car','bike','car','auto','bike','car','truck','bike','car','auto','car','bike','car','truck','auto','bike','car','bike','car','auto','truck'];
  const sdStats          = ['ONLINE','ONLINE','ONLINE','ONLINE','ONLINE','ONLINE','ONLINE','ONLINE','ONLINE','ONLINE','ON_TRIP','ON_TRIP','ON_TRIP','ON_TRIP','ON_TRIP','SCHEDULED','SCHEDULED','SCHEDULED','OFFLINE','OFFLINE','ONLINE','ONLINE','ONLINE','ONLINE','ONLINE'];

  for (let i = 0; i < 25; i++) {
    const l   = L(i+8);
    const vt  = sdVT[i];
    const c   = VC[vt];
    const us  = sdStats[i] === 'SCHEDULED' ? 'ONLINE' : sdStats[i] as 'ONLINE'|'ON_TRIP'|'OFFLINE';
    const ds  = us==='ON_TRIP' ? 'ON_TRIP' : us==='OFFLINE' ? 'OFFLINE' : 'AVAILABLE';
    const vs: 'AVAILABLE'|'ON_TRIP'|'OFFLINE' = us==='ON_TRIP' ? 'ON_TRIP' : us==='OFFLINE' ? 'OFFLINE' : 'AVAILABLE';

    const sd = await mkUser({
      name:uName(), email:`selfdriver${i}@cargo.com`, phone:uPhone('90'),
      age:rI(25,50), gender:i%6===0?'female':'male',
      roles:['passenger','driver','owner'], status:us,
      permanentAddress:mkAddr(l), currentLocation:mkGeo(l),
      driverInfo:{ licenses:[{ licenseType:c.lic, licenseNumber:uLic(c.lic), licenseImage:IMG, vehicleCategory:vt, hourlyRate:rEl([...c.hrR]), isActive:true, isVerified:true }], status:ds, rating:rF(4.0,5.0), totalTrips:rI(20,200), idProof:IMG },
      ownerInfo:{ vehicles:[], rating:rF(4.0,5.0), totalTrips:rI(20,200) },
      publicInfo:{ rating:rF(4.0,5.0), totalTrips:rI(20,200), memberSince:new Date(Date.now()-rI(60,800)*86400000) },
    }, rI(500,3000), rI(5000,30000));

    const v = await mkVehicle(sd._id, sd._id, true, vt, vs, i+8);
    sd.driverInfo.linkedVehicleId = v._id;
    sd.ownerInfo = { vehicles:[v._id], rating:sd.ownerInfo?.rating, totalTrips:sd.ownerInfo?.totalTrips };
    await sd.save();
    SD.push({ user:sd, vehicle:v });
  }
  console.log(`✅ Self Drivers: ${SD.length}`);

  // ═════════════════════════════════════════════════════════
  // BOOKINGS & SCENARIOS
  // ═════════════════════════════════════════════════════════
  console.log('⏳ Creating scenarios...');

  // ── SCENARIO A: COMPLETED — Self Driver (10x) ──
  for (let i = 0; i < 10; i++) {
    const p  = P[i]; const sd = SD[i];
    const vt = sd.vehicle.vehicleType as VT; const c = VC[vt];
    const eH = rF(0.5,3); const eK = rF(10,80);
    const f  = mkFare(rEl([...c.hrR]), sd.vehicle.perKmRate, c.lic, eH, eK, true);
    const b  = await Booking.create({
      passenger:p._id, driver:sd.user._id, owner:sd.user._id, vehicle:sd.vehicle._id,
      bookingType:rEl(['INSTANT','SCHEDULED']), status:'COMPLETED',
      passengers:rI(1,c.seats), vehicleType:vt,
      pickup:mkLoc(L(i)), dropoff:mkLoc(L(i+5)),
      fare:f, payment:{ method:'WALLET', status:'PAID', amount:f.estimatedFare },
      tripData:{ startTime:new Date(Date.now()-rI(2,48)*3600000), endTime:new Date(Date.now()-rI(1,5)*3600000), actualDistance:rF(eK*0.9,eK*1.1), actualDuration:rF(eH*0.9,eH*1.1) },
    });
    await Review.create({ bookingId:b._id, reviewerId:p._id, revieweeId:sd.user._id, rating:rI(3,5), comment:rEl(['Acchi ride!','Bahut badhiya!','Punctual.']), reviewType:'passenger_to_driver', isPublic:true });
    await Review.create({ bookingId:b._id, reviewerId:sd.user._id, revieweeId:p._id, rating:rI(3,5), comment:rEl(['Good passenger.','Cooperative.','Polite.']), reviewType:'driver_to_passenger', isPublic:true });
    addN(p._id,       'trip_completed',  'Trip Complete!',    `Driver ko rate karo.`, b._id);
    addN(sd.user._id, 'payment_received','Payment Mila!',     `₹${f.estimatedFare} credit hua.`, b._id);
  }

  // ── SCENARIO B: COMPLETED — Pure Driver + Owner pair (10x) ──
  for (let i = 0; i < 10; i++) {
    const p = P[i]; const drv = D[i]; const ov = OV[i];
    const vt = ov.vehicle.vehicleType as VT; const c = VC[vt];
    const eH = rF(1,4); const eK = rF(20,120);
    const f  = mkFare(rEl([...c.hrR]), ov.vehicle.perKmRate, c.lic, eH, eK, false);
    const b  = await Booking.create({
      passenger:p._id, driver:drv._id, owner:ov.owner._id, vehicle:ov.vehicle._id,
      bookingType:'SCHEDULED', status:'COMPLETED',
      passengers:rI(1,c.seats), vehicleType:vt,
      pickup:mkLoc(L(i)), dropoff:mkLoc(L(i+8)),
      fare:f, payment:{ method:'WALLET', status:'PAID', amount:f.estimatedFare },
      tripData:{ startTime:new Date(Date.now()-rI(4,72)*3600000), endTime:new Date(Date.now()-rI(1,3)*3600000), actualDistance:rF(eK*0.9,eK*1.1), actualDuration:rF(eH*0.9,eH*1.1) },
    });
    await Review.create({ bookingId:b._id, reviewerId:p._id, revieweeId:drv._id, rating:rI(3,5), comment:'Driver was good.', reviewType:'passenger_to_driver', isPublic:true });
        await Review.create({ bookingId:b._id, reviewerId:drv._id, revieweeId:p._id, rating:rI(3,5), comment:'Good passenger.', reviewType:'driver_to_passenger', isPublic:true });
    addN(p._id,         'trip_completed',  'Trip Complete!',  `${L(i).place} se ${L(i+8).place} trip done.`, b._id);
    addN(drv._id,       'payment_received','Driver Earnings', `₹${f.driverEarning} credited.`, b._id);
    addN(ov.owner._id,  'payment_received','Owner Earnings',  `₹${f.ownerEarning} credited.`, b._id);
  }

  // ── SCENARIO C: INSTANT REQUESTED — 60s timer (10x) ──
  for (let i = 0; i < 10; i++) {
    const p = P[i]; const sd = SD[10+i];
    const vt = sd.vehicle.vehicleType as VT; const c = VC[vt];
    const f  = mkFare(rEl([...c.hrR]), sd.vehicle.perKmRate, c.lic, rF(0.3,1), rF(5,20), true);
    const b  = await Booking.create({
      passenger:p._id, bookingType:'INSTANT', status:'REQUESTED',
      passengers:1, vehicleType:vt,
      pickup:mkLoc(L(i)), dropoff:mkLoc(L(i+3)), fare:f,
    });
    await BookingRequest.create({
      booking:b._id, passenger:p._id,
      pair:{ driver:sd.user._id, owner:sd.user._id, vehicle:sd.vehicle._id, isCombo:true },
      driverResponse:'PENDING', ownerResponse:'NA', status:'PENDING',
      estimatedFare:f.estimatedFare, distanceKm:f.estimatedDistance,
      requestedAt:new Date(), expiresAt:new Date(Date.now()+60000), requestType:'instant',
    });
    addN(sd.user._id, 'booking_request','Naya Instant Request!',`${p.name} ne ${vt} book ki.`, b._id);
  }

  // ── SCENARIO D: SCHEDULED REQUESTED — driver pending (5x) ──
  for (let i = 0; i < 5; i++) {
    const p = P[i]; const drv = D[5+i]; const ov = OV[5+i];
    const vt = ov.vehicle.vehicleType as VT; const c = VC[vt];
    const sAt = new Date(Date.now()+rI(24,72)*3600000);
    const f   = mkFare(rEl([...c.hrR]), ov.vehicle.perKmRate, c.lic, rF(1,5), rF(30,150), false);
    const b   = await Booking.create({
      passenger:p._id, bookingType:'SCHEDULED', status:'REQUESTED',
      passengers:rI(1,c.seats), vehicleType:vt, scheduledDateTime:sAt,
      pickup:mkLoc(L(i+2)), dropoff:mkLoc(L(i+12)), fare:f,
    });
    await BookingRequest.create({
      booking:b._id, passenger:p._id,
      pair:{ driver:drv._id, owner:ov.owner._id, vehicle:ov.vehicle._id, isCombo:false },
      driverResponse:'PENDING', ownerResponse:'PENDING', status:'PENDING',
      estimatedFare:f.estimatedFare, distanceKm:f.estimatedDistance,
      requestedAt:new Date(), expiresAt:new Date(sAt.getTime()-7200000), requestType:'scheduled',
    });
    addN(drv._id,      'booking_request','Naya Prebooking!', `${p.name} ki scheduled trip.`, b._id);
    addN(ov.owner._id, 'booking_request','Naya Prebooking!', `Driver respond karne wala hai.`, b._id);
  }

  // ── SCENARIO E: SCHEDULED REQUESTED — driver accepted, owner pending (5x) ──
  for (let i = 0; i < 5; i++) {
    const p = P[5+i]; const drv = D[10+i]; const ov = OV[10+i];
    const vt = ov.vehicle.vehicleType as VT; const c = VC[vt];
    const sAt = new Date(Date.now()+rI(12,48)*3600000);
    const f   = mkFare(rEl([...c.hrR]), ov.vehicle.perKmRate, c.lic, rF(1,4), rF(20,100), false);
    const b   = await Booking.create({
      passenger:p._id, bookingType:'SCHEDULED', status:'REQUESTED',
      passengers:rI(1,c.seats), vehicleType:vt, scheduledDateTime:sAt,
      pickup:mkLoc(L(i+3)), dropoff:mkLoc(L(i+13)), fare:f,
    });
    await BookingRequest.create({
      booking:b._id, passenger:p._id,
      pair:{ driver:drv._id, owner:ov.owner._id, vehicle:ov.vehicle._id, isCombo:false },
      driverResponse:'ACCEPTED', ownerResponse:'PENDING', status:'PENDING',
      estimatedFare:f.estimatedFare, distanceKm:f.estimatedDistance,
      requestedAt:new Date(), expiresAt:new Date(sAt.getTime()-7200000), requestType:'scheduled',
    });
    addN(ov.owner._id, 'booking_request','Owner Response Chahiye!', `Driver ne accept kiya. Aapka turn hai.`, b._id);
  }

  // ── SCENARIO F: BOTH_ACCEPTED — passenger confirm karne wala (10x) ──
  for (let i = 0; i < 10; i++) {
    const p = P[i]; const drv = D[i]; const ov = OV[i % OV.length];
    const vt = ov.vehicle.vehicleType as VT; const c = VC[vt];
    const sAt = new Date(Date.now()+rI(6,36)*3600000);
    const f   = mkFare(rEl([...c.hrR]), ov.vehicle.perKmRate, c.lic, rF(1,3), rF(20,80), false);
    const b   = await Booking.create({
      passenger:p._id, bookingType:'SCHEDULED', status:'REQUESTED',
      passengers:rI(1,c.seats), vehicleType:vt, scheduledDateTime:sAt,
      pickup:mkLoc(L(i+4)), dropoff:mkLoc(L(i+14)), fare:f,
    });
    await BookingRequest.create({
      booking:b._id, passenger:p._id,
      pair:{ driver:drv._id, owner:ov.owner._id, vehicle:ov.vehicle._id, isCombo:false },
      driverResponse:'ACCEPTED', ownerResponse:'ACCEPTED', status:'BOTH_ACCEPTED',
      estimatedFare:f.estimatedFare, distanceKm:f.estimatedDistance,
      requestedAt:new Date(Date.now()-1800000), expiresAt:new Date(sAt.getTime()-7200000),
      respondedAt:new Date(), requestType:'scheduled',
    });
    addN(p._id, 'booking_accepted','Driver & Owner Ready!', `Pair ne accept kiya. Confirm karo!`, b._id);
  }

  // ── SCENARIO G: ACCEPTED + Escrow Locked — Self Driver (10x) ──
  for (let i = 0; i < 10; i++) {
    const p = P[i]; const sd = SD[i];
    const vt = sd.vehicle.vehicleType as VT; const c = VC[vt];
    const sAt = new Date(Date.now()+rI(6,24)*3600000);
    const f   = mkFare(rEl([...c.hrR]), sd.vehicle.perKmRate, c.lic, rF(0.5,2), rF(10,50), true);
    const b   = await Booking.create({
      passenger:p._id, driver:sd.user._id, owner:sd.user._id, vehicle:sd.vehicle._id,
      bookingType:'SCHEDULED', status:'ACCEPTED',
      passengers:rI(1,c.seats), vehicleType:vt, scheduledDateTime:sAt,
      pickup:mkLoc(L(i)), dropoff:mkLoc(L(i+6)), fare:f,
      payment:{ method:'WALLET', status:'PENDING', amount:f.estimatedFare },
    });
    addN(p._id,       'booking_accepted','Booking Confirmed!',  `₹${f.estimatedFare} blocked. Trip ${new Date(sAt).toLocaleDateString()} ko.`, b._id);
    addN(sd.user._id, 'booking_accepted','Trip Scheduled!',     `${p.name} ki trip confirm.`, b._id);
  }

  // ── SCENARIO H: ACCEPTED + Escrow Locked — Driver+Owner (10x) ──
  for (let i = 0; i < 10; i++) {
    const p = P[i%P.length]; const drv = D[i]; const ov = OV[i%OV.length];
    const vt = ov.vehicle.vehicleType as VT; const c = VC[vt];
    const sAt = new Date(Date.now()+rI(4,20)*3600000);
    const f   = mkFare(rEl([...c.hrR]), ov.vehicle.perKmRate, c.lic, rF(1,3), rF(30,100), false);
    await Booking.create({
      passenger:p._id, driver:drv._id, owner:ov.owner._id, vehicle:ov.vehicle._id,
      bookingType:'SCHEDULED', status:'ACCEPTED',
      passengers:rI(1,c.seats), vehicleType:vt, scheduledDateTime:sAt,
      pickup:mkLoc(L(i+1)), dropoff:mkLoc(L(i+10)), fare:f,
      payment:{ method:'WALLET', status:'PENDING', amount:f.estimatedFare },
    });
  }

  // ── SCENARIO I: ENROUTE — Driver coming to pickup (10x) ──
  for (let i = 0; i < 10; i++) {
    const p = P[i]; const sd = SD[i];
    const vt = sd.vehicle.vehicleType as VT; const c = VC[vt];
    const f  = mkFare(rEl([...c.hrR]), sd.vehicle.perKmRate, c.lic, rF(0.3,1), rF(5,25), true);
    const b  = await Booking.create({
      passenger:p._id, driver:sd.user._id, owner:sd.user._id, vehicle:sd.vehicle._id,
      bookingType:'INSTANT', status:'ENROUTE',
      passengers:1, vehicleType:vt,
      pickup:mkLoc(L(i)), dropoff:mkLoc(L(i+4)), fare:f,
      payment:{ method:'WALLET', status:'PENDING', amount:f.estimatedFare },
    });
    await Trip.create({
      bookingId:b._id,
      liveTracking:{ isActive:true, currentLocation:{ lat:L(i).lat+rF(-0.02,0.02), lng:L(i).lng+rF(-0.02,0.02), timestamp:new Date() }, route:[{ lat:L(i).lat, lng:L(i).lng, timestamp:new Date(Date.now()-300000), speed:rI(20,50) }] },
    });
    addN(p._id, 'booking_accepted','Driver Aa Raha Hai!', `${sd.user.name} pickup ke liye aa raha hai.`, b._id);
  }

  // ── SCENARIO J: STARTED — Live trip in progress (10x) ──
  for (let i = 0; i < 10; i++) {
    const sd = SD[10+i]; // ON_TRIP wale
    const p  = P[i];
    const vt = sd.vehicle.vehicleType as VT; const c = VC[vt];
    const f  = mkFare(rEl([...c.hrR]), sd.vehicle.perKmRate, c.lic, rF(0.5,2), rF(10,50), true);
    const b  = await Booking.create({
      passenger:p._id, driver:sd.user._id, owner:sd.user._id, vehicle:sd.vehicle._id,
      bookingType:'INSTANT', status:'STARTED',
      passengers:1, vehicleType:vt,
      pickup:mkLoc(L(i+1)), dropoff:mkLoc(L(i+7)), fare:f,
      payment:{ method:'WALLET', status:'PENDING', amount:f.estimatedFare },
      tripData:{ startTime:new Date(Date.now()-rI(10,30)*60000) },
    });
    await Trip.create({
      bookingId:b._id,
      liveTracking:{
        isActive:true,
        currentLocation:{ lat:L(i+1).lat+rF(0,0.05), lng:L(i+1).lng+rF(0,0.05), timestamp:new Date() },
        route:[
          { lat:L(i+1).lat,             lng:L(i+1).lng,             timestamp:new Date(Date.now()-900000), speed:rI(30,60) },
          { lat:L(i+1).lat+rF(0,0.02),  lng:L(i+1).lng+rF(0,0.02), timestamp:new Date(Date.now()-600000), speed:rI(30,60) },
          { lat:L(i+1).lat+rF(0.02,0.04),lng:L(i+1).lng+rF(0.02,0.04),timestamp:new Date(Date.now()-300000),speed:rI(30,60) },
        ],
      },
      approvals:{ passengerApproval:false, ownerApproval:false },
    });
    addN(p._id, 'trip_started','Trip Shuru!', `Safe journey! Trip chal rahi hai.`, b._id);
  }

  // ── SCENARIO K: CANCELLED before lock — no charge (10x) ──
  for (let i = 0; i < 10; i++) {
    const p = P[i]; const sd = SD[i%SD.length];
    const vt = sd.vehicle.vehicleType as VT; const c = VC[vt];
    const f  = mkFare(rEl([...c.hrR]), sd.vehicle.perKmRate, c.lic, rF(0.5,1.5), rF(10,40), true);
    await Booking.create({
      passenger:p._id, driver:sd.user._id, owner:sd.user._id, vehicle:sd.vehicle._id,
      bookingType:rEl(['INSTANT','SCHEDULED']), status:'CANCELLED',
      passengers:1, vehicleType:vt,
      pickup:mkLoc(L(i)), dropoff:mkLoc(L(i+5)), fare:f,
      cancellation:{ isCancelled:true, cancelledBy:'PASSENGER', reason:rEl(['Change of plans','Emergency','Wrong location','Found another ride']), cancellationFee:0, timestamp:new Date(Date.now()-rI(1,24)*3600000) },
    });
  }

  // ── SCENARIO L: CANCELLED after lock — pickup charge (10x) ──
  for (let i = 0; i < 10; i++) {
    const p = P[i]; const sd = SD[i%SD.length];
    const vt = sd.vehicle.vehicleType as VT; const c = VC[vt];
    const f  = mkFare(rEl([...c.hrR]), sd.vehicle.perKmRate, c.lic, rF(0.5,2), rF(15,60), true);
    const pc = Math.round(sd.vehicle.perKmRate * 1);
    await Booking.create({
      passenger:p._id, driver:sd.user._id, owner:sd.user._id, vehicle:sd.vehicle._id,
      bookingType:'SCHEDULED', status:'CANCELLED',
      passengers:1, vehicleType:vt,
      pickup:mkLoc(L(i+2)), dropoff:mkLoc(L(i+9)), fare:f,
      payment:{ method:'WALLET', status:'REFUNDED', amount:f.estimatedFare-pc-f.platformFee },
      cancellation:{ isCancelled:true, cancelledBy:'PASSENGER', reason:'Plans changed', cancellationFee:pc, platformFee:f.platformFee, timestamp:new Date(Date.now()-rI(1,12)*3600000) },
    });
    addN(p._id, 'cancellation','Booking Cancel', `Pickup charge ₹${pc} deducted. Baki refund ho gaya.`);
  }

  // ── SCENARIO M: CANCELLED by driver — full refund + penalty (10x) ──
  for (let i = 0; i < 10; i++) {
    const p = P[i]; const drv = D[i]; const ov = OV[i%OV.length];
    const vt = ov.vehicle.vehicleType as VT; const c = VC[vt];
    const f  = mkFare(rEl([...c.hrR]), ov.vehicle.perKmRate, c.lic, rF(1,3), rF(20,80), false);
    await Booking.create({
      passenger:p._id, driver:drv._id, owner:ov.owner._id, vehicle:ov.vehicle._id,
      bookingType:'SCHEDULED', status:'CANCELLED',
      passengers:rI(1,3), vehicleType:vt,
      pickup:mkLoc(L(i)), dropoff:mkLoc(L(i+8)), fare:f,
      payment:{ method:'WALLET', status:'REFUNDED', amount:f.estimatedFare },
      cancellation:{ isCancelled:true, cancelledBy:'DRIVER', reason:'Personal emergency', cancellationFee:0, timestamp:new Date(Date.now()-rI(1,48)*3600000) },
    });
    addN(p._id,   'cancellation','Driver Ne Cancel Kiya', 'Full refund de diya gaya.');
    addN(drv._id, 'cancellation','Warning Mila',          'Trip cancel karne par warning diya gaya.');
  }

  // ── SCENARIO N: CANCELLED by owner reject (10x) ──
  for (let i = 0; i < 10; i++) {
    const p = P[i%P.length]; const drv = D[i%D.length]; const ov = OV[i%OV.length];
    const vt = ov.vehicle.vehicleType as VT; const c = VC[vt];
    const f  = mkFare(rEl([...c.hrR]), ov.vehicle.perKmRate, c.lic, rF(1,3), rF(20,80), false);
    await Booking.create({
      passenger:p._id, driver:drv._id, owner:ov.owner._id, vehicle:ov.vehicle._id,
      bookingType:'SCHEDULED', status:'CANCELLED',
      passengers:rI(1,3), vehicleType:vt,
      pickup:mkLoc(L(i+3)), dropoff:mkLoc(L(i+11)), fare:f,
      cancellation:{ isCancelled:true, cancelledBy:'OWNER', reason:'Vehicle unavailable', cancellationFee:0, timestamp:new Date(Date.now()-rI(1,24)*3600000) },
    });
    addN(p._id, 'cancellation','Owner Ne Reject Kiya', 'Koi charge nahi. Doosra pair choose karo.');
  }

  // ── SCENARIO O: EXPIRED requests (10x) ──
  for (let i = 0; i < 10; i++) {
    const p = P[i]; const sd = SD[i%SD.length];
    const vt = sd.vehicle.vehicleType as VT; const c = VC[vt];
    const f  = mkFare(rEl([...c.hrR]), sd.vehicle.perKmRate, c.lic, rF(0.5,1), rF(10,30), true);
    const b  = await Booking.create({
      passenger:p._id, bookingType:'INSTANT', status:'REQUESTED',
      passengers:1, vehicleType:vt,
      pickup:mkLoc(L(i)), dropoff:mkLoc(L(i+3)), fare:f,
    });
    await BookingRequest.create({
      booking:b._id, passenger:p._id,
      pair:{ driver:sd.user._id, owner:sd.user._id, vehicle:sd.vehicle._id, isCombo:true },
      driverResponse:'PENDING', ownerResponse:'NA', status:'EXPIRED',
      estimatedFare:f.estimatedFare, distanceKm:f.estimatedDistance,
      requestedAt:new Date(Date.now()-300000), expiresAt:new Date(Date.now()-240000),
      expiryReason:'Driver did not respond in time',
    });
    addN(p._id, 'cancellation','Request Expire!', 'Koi driver nahi mila. Dobara try karo.', b._id);
  }

  // ── SCENARIO P: RELEASED requests (10x) ──
  for (let i = 0; i < 10; i++) {
    const p = P[i]; const sd = SD[i%SD.length];
    const vt = sd.vehicle.vehicleType as VT; const c = VC[vt];
    const f  = mkFare(rEl([...c.hrR]), sd.vehicle.perKmRate, c.lic, rF(0.5,1), rF(10,30), true);
    const b  = await Booking.create({
      passenger:p._id, bookingType:'INSTANT', status:'ACCEPTED',
      passengers:1, vehicleType:vt,
      pickup:mkLoc(L(i)), dropoff:mkLoc(L(i+4)), fare:f,
    });
    await BookingRequest.create({
      booking:b._id, passenger:p._id,
      pair:{ driver:sd.user._id, owner:sd.user._id, vehicle:sd.vehicle._id, isCombo:true },
      driverResponse:'ACCEPTED', ownerResponse:'NA', status:'RELEASED',
      estimatedFare:f.estimatedFare, distanceKm:f.estimatedDistance,
      requestedAt:new Date(Date.now()-180000), expiresAt:new Date(Date.now()+57000),
      respondedAt:new Date(),
    });
  }

  // ── SCENARIO Q: REJECTED requests (10x) ──
  for (let i = 0; i < 10; i++) {
    const p = P[i]; const drv = D[i]; const ov = OV[i%OV.length];
    const vt = ov.vehicle.vehicleType as VT; const c = VC[vt];
    const f  = mkFare(rEl([...c.hrR]), ov.vehicle.perKmRate, c.lic, rF(1,2), rF(20,60), false);
    const b  = await Booking.create({
      passenger:p._id, bookingType:'SCHEDULED', status:'CANCELLED',
      passengers:rI(1,3), vehicleType:vt,
      pickup:mkLoc(L(i+1)), dropoff:mkLoc(L(i+9)), fare:f,
      cancellation:{ isCancelled:true, cancelledBy:'DRIVER', reason:'Not available', cancellationFee:0, timestamp:new Date() },
    });
    await BookingRequest.create({
      booking:b._id, passenger:p._id,
      pair:{ driver:drv._id, owner:ov.owner._id, vehicle:ov.vehicle._id, isCombo:false },
      driverResponse:'REJECTED', ownerResponse:'PENDING', status:'REJECTED',
      estimatedFare:f.estimatedFare, distanceKm:f.estimatedDistance,
      requestedAt:new Date(Date.now()-7200000), expiresAt:new Date(Date.now()+79200000),
      respondedAt:new Date(),
    });
  }

  // ── Penalty: Driver suspended ──
  await User.findByIdAndUpdate(D[22]._id, {
    isActive:false, suspensionUntil:new Date(Date.now()+7*86400000), warnings:3, redCards:1,
    penaltyHistory:[
      { type:'WARNING',  reason:'Late to pickup',       timestamp:new Date(Date.now()-10*86400000) },
      { type:'WARNING',  reason:'Rude to passenger',    timestamp:new Date(Date.now()-8*86400000)  },
      { type:'WARNING',  reason:'Did not arrive',       timestamp:new Date(Date.now()-5*86400000)  },
      { type:'RED_CARD', reason:'Trip cancelled twice', timestamp:new Date(Date.now()-3*86400000)  },
    ],
  });

  // ── Penalty: Driver permanently banned ──
  await User.findByIdAndUpdate(D[23]._id, {
    isActive:false, isBanned:true, redCards:5,
    penaltyHistory:[
      { type:'RED_CARD', reason:'No-show 5 times', timestamp:new Date(Date.now()-30*86400000) },
    ],
  });

  // ── Save all notifications ──
  for (const n of notifs) await new Notification(n).save();

  // ═════════════════════════════════════════════════════════
  // SUMMARY
  // ═════════════════════════════════════════════════════════
  const totalU = 1 + P.length + D.length + O.length + SD.length;
  const totalV = OV.length + SD.length;

  console.log(`
╔═════════════════════════════════════════════════════════╗
║              ✅ CARGO SEED COMPLETE!                    ║
╠═════════════════════════════════════════════════════════╣
║  Admin:                    1                            ║
║  Passengers:               ${String(P.length).padEnd(29)}║
║  Pure Drivers:             ${String(D.length).padEnd(29)}║
║  Pure Owners:              ${String(O.length).padEnd(29)}║
║  Self Drivers (Combo):     ${String(SD.length).padEnd(29)}║
║  ─────────────────────────────────────────────────────  ║
║  Total Users:              ${String(totalU).padEnd(29)}║
║  Total Vehicles:           ${String(totalV).padEnd(29)}║
║  Notifications:            ${String(notifs.length).padEnd(29)}║
╠═════════════════════════════════════════════════════════╣
║  SCENARIOS (each 10x):                                  ║
║  A  Completed — Self Driver                   ✅ x10   ║
║  B  Completed — Driver + Owner pair           ✅ x10   ║
║  C  Instant REQUESTED (60s timer)             ✅ x10   ║
║  D  Scheduled REQUESTED (driver pending)      ✅ x5    ║
║  E  Scheduled REQUESTED (owner pending)       ✅ x5    ║
║  F  BOTH_ACCEPTED (passenger to confirm)      ✅ x10   ║
║  G  ACCEPTED + Escrow — Self Driver           ✅ x10   ║
║  H  ACCEPTED + Escrow — Driver+Owner          ✅ x10   ║
║  I  ENROUTE (driver coming to pickup)         ✅ x10   ║
║  J  STARTED + Live tracking                   ✅ x10   ║
║  K  CANCELLED before lock (no charge)         ✅ x10   ║
║  L  CANCELLED after lock (pickup charge)      ✅ x10   ║
║  M  CANCELLED by driver (penalty)             ✅ x10   ║
║  N  CANCELLED by owner (reject)               ✅ x10   ║
║  O  EXPIRED requests                          ✅ x10   ║
║  P  RELEASED requests                         ✅ x10   ║
║  Q  REJECTED requests                         ✅ x10   ║
║  R  Driver suspended                          ✅ x1    ║
║  S  Driver permanently banned                 ✅ x1    ║
╠═════════════════════════════════════════════════════════╣
║  Area: Chandrapur + Yavatmal District, Maharashtra      ║
║  Password: password123 (all users)                      ║
║  admin@cargo.com          — Admin                       ║
║  passenger0-19@cargo.com  — Passengers                  ║
║  driver0-24@cargo.com     — Pure Drivers                ║
║  owner0-19@cargo.com      — Pure Owners                 ║
║  selfdriver0-24@cargo.com — Self Drivers                ║
╚═════════════════════════════════════════════════════════╝
  `);

  await mongoose.connection.close();
};

seed().catch(err => {
  console.error('\n❌ Seeding failed:', err);
  mongoose.connection.close();
});