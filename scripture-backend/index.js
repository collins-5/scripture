import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import scriptureRouter from './routes/scripture.js';
import userFeaturesRouter from './routes/userFeatures.js';
import { startDailyVerseJob } from './jobs/daily-verse.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('CRITICAL ERROR: MONGO_URI environment variable is missing.');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Cloud Database connected successfully.');
    startDailyVerseJob();
  })
  .catch((err) => console.error('Cloud Database connection error:', err));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bible API Backend is operating correctly!');
});

app.use('/api', scriptureRouter);
app.use('/api', userFeaturesRouter);

app.listen(PORT, () => {
  console.log(`Server is running live on http://localhost:${PORT}`);
});