import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import scriptureRouter from '../routes/scripture.js';
import userFeaturesRouter from '../routes/userFeatures.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.send('Bible API Backend is operating correctly!');
});

app.use('/api', scriptureRouter);
app.use('/api', userFeaturesRouter);

const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  if (!MONGO_URI) {
    return res.status(500).json({ success: false, message: 'MONGO_URI missing.' });
  }
  await connectDB();
  return app(req, res);
}