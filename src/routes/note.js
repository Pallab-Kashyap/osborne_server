const express = require('express');
const router = express.Router();
const { getNotes, createNote, deleteNote } = require('../controller/noteController');

router.get('/', getNotes);
router.post('/', createNote);
router.delete('/:id', deleteNote);

module.exports = router;
