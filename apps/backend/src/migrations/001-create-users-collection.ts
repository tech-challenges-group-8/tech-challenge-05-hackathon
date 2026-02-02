import mongoose from 'mongoose';

async function run(): Promise<void> {
  const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/mindease';
  await mongoose.connect(uri);

  const db = mongoose.connection.db;
  const collections = await db.listCollections({ name: 'users' }).toArray();

  if (collections.length === 0) {
    await db.createCollection('users');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('✅ users collection created');
  } else {
    console.log('ℹ️ users collection already exists');
  }

  await mongoose.disconnect();
}

run().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
