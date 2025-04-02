const express = require('express');
const router = express.Router();
const { getBookmarks, createBookmark, deleteBookmark } = require('../controller/bookmarkController');
const auth = require('../middleware/auth');

// Protect all bookmark routes with auth
router.use(auth);

router.route('/')
  .get(getBookmarks)
  .post(createBookmark);

router.route('/:id')
  .delete(deleteBookmark);

module.exports = router;