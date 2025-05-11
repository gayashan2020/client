// src/lib/dbConnect.js
import { MongoClient } from 'mongodb';

let client;
let clientPromise;

async function dbConnect() {
  if (!clientPromise) {
    client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    // store the promise — but if it rejects, clear it so the next call re-tries
    clientPromise = client.connect().catch(err => {
      clientPromise = null;
      throw err;
    });
  }

  // this await may throw if connect() failed
  await clientPromise;

  const db = client.db(process.env.MONGODB_DB);
  return { client, db };
}

export default dbConnect;
