import express from 'express';
import axios from 'axios';
import { resolveBookCode } from '../constants/books.js';

const router = express.Router();

router.get('/versions', async (req, res) => {
  try {
    const response = await axios.get('https://bible.helloao.org/api/available_translations.json');
    return res.json({
      success: true,
      translations: response.data.translations
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Could not retrieve translation versions." });
  }
});

router.get('/scripture', async (req, res) => {
  try {
    let { version = 'BSB', book = 'JHN', chapter = '3', verse } = req.query;

    const cleanVersion = version.toString().trim();
    const requestedBook = book.toString().trim();
    const cleanBook = resolveBookCode(requestedBook) ?? requestedBook.toUpperCase();

    if (chapter.toString().includes(':')) {
      const parts = chapter.toString().split(':');
      chapter = parts[0];
      verse = parts[1];
    }

    const cleanChapter = chapter.toString().trim();
    const targetUrl = `https://bible.helloao.org/api/${cleanVersion}/${cleanBook}/${cleanChapter}.json`;

    const response = await axios.get(targetUrl);
    const fullChapterData = response.data;

    let finalVerses = fullChapterData.chapter.content;

    if (verse) {
      const targetVerseNum = parseInt(verse.toString().trim(), 10);

      finalVerses = fullChapterData.chapter.content.filter((item) => {
        return item.type === 'verse' && parseInt(item.number, 10) === targetVerseNum;
      });

      if (finalVerses.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Verse ${targetVerseNum} was not found inside ${requestedBook} Chapter ${cleanChapter}.`
        });
      }
    }

    return res.json({
      success: true,
      metadata: {
        version: cleanVersion,
        book: requestedBook,
        apiBook: cleanBook,
        chapter: parseInt(cleanChapter, 10),
        verse: verse ? parseInt(verse.toString(), 10) : null,
        bookName: fullChapterData.book.name,
      },
      chapterContent: finalVerses
    });

  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Scripture path not found."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error reading scripture payload."
    });
  }
});

export default router;