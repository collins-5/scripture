import cron from 'node-cron';
import axios from 'axios';
import { User } from '../models/schemas.js';
import { pickVerseForDate } from '../data/daily-verses.js';

async function sendDailyVerse() {
  try {
    const verse = pickVerseForDate();

    const users = await User.find({ pushToken: { $ne: '' } });
    const tokens = users.map((u) => u.pushToken).filter(Boolean);

    if (tokens.length === 0) {
      return;
    }

    const messages = tokens.map((token) => ({
      to: token,
      sound: 'default',
      title: 'Verse of the Day',
      body: `"${verse.text}" — ${verse.book} ${verse.chapter}:${verse.verse}`,
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

    const tickets = [];
    for (const chunk of chunks) {
      const response = await axios.post(
        'https://exp.host/--/api/v2/push/send',
        chunk,
        { headers: { 'Content-Type': 'application/json' } },
      );
      const rows = response.data?.data ?? [];

      await Promise.all(
        rows.map(async (ticket, index) => {
          if (
            ticket.status === 'error' &&
            ticket.details?.error === 'DeviceNotRegistered'
          ) {
            await User.updateOne(
              { pushToken: chunk[index].to },
              { pushToken: '' },
            );
          }
        }),
      );

      tickets.push(...rows);
    }
  } catch (error) {
    return;
  }
}

export function startDailyVerseJob() {
  cron.schedule('0 7 * * *', sendDailyVerse, {
    timezone: 'Africa/Nairobi',
  });
}

export { sendDailyVerse };