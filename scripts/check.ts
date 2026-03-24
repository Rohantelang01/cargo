import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI!;
console.log('Connecting to:', uri);

mongoose.connect(uri).then(async () => {
  const db = mongoose.connection.db!;
  const dbName = db.databaseName;
  console.log('Connected to database:', dbName);
  
  const collections = await db.listCollections().toArray();
  console.log('\nCollections found:');
  for (const col of collections) {
    const count = await db.collection(col.name).countDocuments();
    console.log(`  ${col.name}: ${count} documents`);
  }
  
  process.exit(0);
});