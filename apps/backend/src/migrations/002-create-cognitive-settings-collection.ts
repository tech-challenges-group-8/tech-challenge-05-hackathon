import mongoose from 'mongoose';

async function run(): Promise<void> {
  const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/mindease';
  await mongoose.connect(uri);

  const db = mongoose.connection.db;
  const collections = await db.listCollections({ name: 'cognitivesettings' }).toArray();

  if (collections.length === 0) {
    await db.createCollection('cognitivesettings');
    await db.collection('cognitivesettings').createIndex({ idUser: 1 }, { unique: true });
    console.log('✅ cognitivesettings collection created');
  } else {
    console.log('ℹ️ cognitivesettings collection already exists');
  }

  await mongoose.disconnect();
}

run().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
