import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { User, Note, SavedVerse } from '../models/schemas.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

function publicUser(user) {
  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    name: user.name,
  };
}

function signToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );
}

router.post('/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email: normalizedEmail,
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
    await newUser.save();

    const token = signToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'User registered.',
      token,
      user: publicUser(newUser),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found.' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid password.' });
    }

    const token = signToken(user);

    return res.json({
      success: true,
      token,
      user: publicUser(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found.' });
    }
    return res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/auth/logout', verifyToken, async (req, res) => {
  return res.json({ success: true, message: 'Logged out.' });
});

router.post('/user/push-token', verifyToken, async (req, res) => {
  try {
    const { token } = req.body;
    await User.findByIdAndUpdate(req.user.userId, { pushToken: token });
    return res.json({ success: true, message: 'Push token saved.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/notes', verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }).sort({
      updatedAt: -1,
    });
    return res.json({ success: true, notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/notes', verifyToken, async (req, res) => {
  try {
    const { book, bookName, chapter, verse, quote, body } = req.body;

    if (!body || !body.trim()) {
      return res
        .status(400)
        .json({ success: false, message: 'Note body is required.' });
    }

    const note = await Note.create({
      userId: req.user.userId,
      book: book ?? '',
      bookName: bookName ?? '',
      chapter: chapter ?? null,
      verse: verse ?? null,
      quote: quote ?? '',
      body: body.trim(),
    });

    return res.status(201).json({ success: true, note });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/notes/:id', verifyToken, async (req, res) => {
  try {
    const { book, bookName, chapter, verse, quote, body } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      {
        book: book ?? '',
        bookName: bookName ?? '',
        chapter: chapter ?? null,
        verse: verse ?? null,
        quote: quote ?? '',
        body: body ?? '',
      },
      { new: true },
    );

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: 'Note not found.' });
    }

    return res.json({ success: true, note });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/notes/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: 'Note not found.' });
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/saved-verses', verifyToken, async (req, res) => {
  try {
    const saved = await SavedVerse.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    return res.json({ success: true, saved });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/saved-verses', verifyToken, async (req, res) => {
  try {
    const { book, bookName, chapter, verse, text, translation } = req.body;

    if (!book || !bookName || !chapter || !verse || !text || !translation) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields.' });
    }

    const entry = await SavedVerse.findOneAndUpdate(
      { userId: req.user.userId, book, chapter, verse, translation },
      {
        userId: req.user.userId,
        book,
        bookName,
        chapter,
        verse,
        text,
        translation,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return res.status(201).json({ success: true, saved: entry });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/saved-verses/:id', verifyToken, async (req, res) => {
  try {
    const entry = await SavedVerse.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!entry) {
      return res
        .status(404)
        .json({ success: false, message: 'Saved verse not found.' });
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/saved-verses/toggle', verifyToken, async (req, res) => {
  try {
    const { book, bookName, chapter, verse, text, translation } = req.body;

    if (!book || !bookName || !chapter || !verse || !text || !translation) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields.' });
    }

    const existing = await SavedVerse.findOne({
      userId: req.user.userId,
      book,
      chapter,
      verse,
      translation,
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({ success: true, saved: false });
    }

    const created = await SavedVerse.create({
      userId: req.user.userId,
      book,
      bookName,
      chapter,
      verse,
      text,
      translation,
    });

    return res.status(201).json({ success: true, saved: true, entry: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/send-daily-reflection', async (req, res) => {
  try {
    const { title, body } = req.body;
    const users = await User.find({ pushToken: { $ne: '' } });
    const tokens = users.map((u) => u.pushToken).filter(Boolean);

    if (tokens.length === 0) {
      return res.json({
        success: true,
        message: 'No active push tokens found.',
      });
    }

    const messages = tokens.map((token) => ({
      to: token,
      sound: 'default',
      title: title || 'Daily Reflection',
      body: body || "Read today's scripture and reflect.",
    }));

    await axios.post('https://exp.host/--/api/v2/push/send', messages, {
      headers: { 'Content-Type': 'application/json' },
    });

    return res.json({ success: true, message: 'Notifications broadcasted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;