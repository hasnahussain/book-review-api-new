const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Book = require('../models/Book');
const Review = require('../models/Review');

router.post('/books', auth, async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: 'Invalid book data', error: err.message });
  }
});

router.get('/books', async (req, res) => {
  try {
    const { author, genre, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (author) filter.author = new RegExp(author, 'i');
    if (genre) filter.genre = genre;

    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/books/:id', async (req, res) => {
  try {
    const { page = 1, limit = 3 } = req.query;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const skip = (page - 1) * limit;
    const reviews = await Review.find({ book: book._id })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const allReviews = await Review.find({ book: book._id }).select('rating');
    const avgRating = allReviews.length
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;

    res.json({
      book,
      avgRating: avgRating.toFixed(2),
      reviews,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Search books by title or author
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });

    const books = await Book.find({
      $or: [
        { title: new RegExp(query, 'i') },
        { author: new RegExp(query, 'i') },
      ],
    });

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
