const express = require('express');
const router = express.Router();
const { getBookmarks, createBookmark, deleteBookmark } = require('../controller/bookmarkController');

// router.route('/')
//   .get(getBookmark)
//   .post(createBookmark);

// router.route('/:id')
//   .delete(deleteBookmark);

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { getBookmarks, createBookmark, deleteBookmark } = require('../controller/bookmarkController');

// Route for getting and creating bookmarks
router.route('/')
  .get(getBookmarks)
  .post(createBookmark);

// Route for deleting bookmarks
router.route('/:id')
  .delete(deleteBookmark);

module.exports = router;