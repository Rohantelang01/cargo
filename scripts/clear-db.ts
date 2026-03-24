
require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('../models/User');
const { Vehicle } = require('../models/Vehicle');
const { Wallet } = require('../models/Wallet');
const { Booking } = require('../models/Booking');
const { Notification: NotificationModel } = require('../models/Notification');
const { PlannedTrip } = require('../models/PlannedTrip');
const { Review } = require('../models/Review');
const { Trip } = require('../models/Trip');
const connectToDB = require('../lib/db').default;

const clearDatabase = async () => {
    console.log('Connecting to database...');
    await connectToDB();
    console.log('Database connected.');

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Wallet.deleteMany({});
    await Booking.deleteMany({});
    await NotificationModel.deleteMany({});
    await PlannedTrip.deleteMany({});
    await Review.deleteMany({});
    await Trip.deleteMany({});
    console.log('All data cleared.');
};

clearDatabase()
    .then(() => {
        console.log('Database clearing complete. Closing connection.');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('An error occurred during database clearing:');
        console.error(err);
        mongoose.connection.close();
    });
