const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Simple approach - directly connect and create admin
const createAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cargo_db';
    await mongoose.connect(mongoURI);
    console.log('🔌 Connected to DB.');

    // Define User schema inline
    const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      phone: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      age: { type: Number, required: true },
      gender: { type: String, required: true },
      roles: { type: [String], required: true },
      isActive: { type: Boolean, default: true },
      permanentAddress: {
        addressLine1: String,
        village: String,
        tehsil: String,
        district: String,
        state: String,
        pincode: String,
        coordinates: { lat: Number, lng: Number }
      },
      currentLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [] }
      }
    }, { timestamps: true });

    // Add password hashing middleware
    userSchema.pre('save', async function (next) {
      if (!this.isModified('password')) return next();
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    });

    const User = mongoose.model('User', userSchema);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@demo.com' });
    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log('📧 Email: admin@demo.com');
      console.log('🔑 Password: password123');
      return;
    }

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@demo.com',
      phone: '9000000000',
      password: 'password123',
      age: 30,
      gender: 'male',
      roles: ['admin'],
      isActive: true,
      permanentAddress: {
        addressLine1: 'Main Road, Warora',
        village: 'Warora',
        tehsil: 'Warora',
        district: 'Chandrapur',
        state: 'Maharashtra',
        pincode: '442907',
        coordinates: { lat: 20.2286, lng: 78.9995 }
      },
      currentLocation: {
        type: 'Point',
        coordinates: [78.9995, 20.2286]
      }
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@demo.com');
    console.log('🔑 Password: password123');
    console.log('🌐 URL: http://localhost:3000/login');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();
