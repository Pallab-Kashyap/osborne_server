const express = require('express');
const router = express.Router();
const { getBookmarks, createBookmark, deleteBookmark } = require('../controller/bookmarkController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/v1/bookmarks:
 *   get:
 *     tags:
 *       - Bookmarks
 *     summary: Get user bookmarks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: publication_id
 *         schema:
 *           type: string
 *         description: Optional publication ID to filter bookmarks
 *     responses:
 *       200:
 *         description: Bookmarks retrieved successfully
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags:
 *       - Bookmarks
 *     summary: Create a new bookmark
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - page
 *               - publication_id
 *             properties:
 *               page:
 *                 type: number
 *                 description: Page number to bookmark
 *               publication_id:
 *                 type: string
 *                 description: Publication ID
 *     responses:
 *       200:
 *         description: Bookmark created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/bookmarks/{id}:
 *   delete:
 *     tags:
 *       - Bookmarks
 *     summary: Delete a bookmark
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bookmark ID
 *     responses:
 *       200:
 *         description: Bookmark deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bookmark not found
 */

// Protect all bookmark routes with auth
// router.use(auth);

// router.route('/')
//   .get(getBookmarks)
//   .post(createBookmark);

// router.route('/:id')
//   .delete(deleteBookmark);

// module.exports = router;


// Protect all bookmark routes with auth
router.use(auth);

router.route('/')
  .get(getBookmarks)
  .post(createBookmark);

router.route('/:id')
  .delete(deleteBookmark);

module.exports = router;