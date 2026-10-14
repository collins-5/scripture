import 'dotenv/config';
import mongoose from 'mongoose';
import axios from 'axios';
import { User } from '../src/models/schemas.js';

await mongoose.connect(process.env.MONGO_URI);

const verse = pickVerseOfTheDay(); // your existing logic

const users = await User.find({ pushToken: { $ne: '' } });
const tokens = users.map((u) => u.pushToken).filter(Boolean);

const messages = tokens.map((token) => ({
  to: token,
  sound: 'default',
  title: 'Verse of the Day',
  body: `"${verse.text}" — ${verse.reference}`,
  data: {
    book: verse.book,
    chapter: verse.chapter,
    verse: verse.verse,
  },
}));

const chunks = [];
for (let i = 0; i < messages.length; i += 100) {
  chunks.push(messages.slice(i, i + 100));
}

for (const chunk of chunks) {
  await axios.post('https://exp.host/--/api/v2/push/send', chunk, {
    headers: { 'Content-Type': 'application/json' },
  });
}

console.log(`Sent ${messages.length} notifications`);
await mongoose.disconnect();