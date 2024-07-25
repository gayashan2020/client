import { MongoClient } from 'mongodb';

let client;
let clientPromise;

async function dbConnect() {
  if (!clientPromise) {
    client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    clientPromise = client.connect();
  }
  await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  return { db, client };
}

export default dbConnect;
