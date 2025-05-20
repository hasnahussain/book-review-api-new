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

// POST a review for a book (auth required)
router.post('/reviews', auth, async (req, res) => {
    try {
      const { book, rating, comment } = req.body;
      if (!book || !rating) {
        return res.status(400).json({ message: 'Book and rating are required' });
      }
  
      const review = new Review({
        book,
        rating,
        comment,
        user: req.user._id, // from auth middleware
      });
  
      await review.save();
      res.status(201).json(review);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // PUT to update a review by ID (auth required)
  router.put('/reviews/:id', auth, async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
  
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      if (review.user.toString() !== req.user._id) {
        return res.status(403).json({ message: 'Unauthorized to update this review' });
      }
  
      review.rating = req.body.rating || review.rating;
      review.comment = req.body.comment || review.comment;
  
      await review.save();
      res.json(review);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
module.exports = router;
