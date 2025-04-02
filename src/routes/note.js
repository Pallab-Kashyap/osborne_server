const express = require('express');
const router = express.Router();
const { getNotes, createNote, updateNote, deleteNote } = require('../controller/noteController');
const auth = require('../middleware/auth');

// Protect all note routes with auth middleware
router.use(auth);

// Routes for getting and creating notes
router.route('/')
  .get(getNotes)  // GET /api/notes?publication_id=123
  .post(createNote);

// Routes for updating and deleting notes
router.route('/:id')
  .put(updateNote)
  .delete(deleteNote);

module.exports = router;