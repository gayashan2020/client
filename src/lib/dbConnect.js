// lib/dbConnect.js

import { MongoClient } from 'mongodb';

let client;

async function dbConnect() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
  }
  const db = client.db(process.env.MONGODB_DB); // database name
  return { db, client };
}

export default dbConnect;