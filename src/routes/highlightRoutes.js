const express = require('express');
const router = express.Router();
const { getHighlights, getHighlightsByPage, createHighlight, deleteHighlight } = require('../controller/highlightController');
const auth = require('../middleware/auth');

router.get('/:publicationId', auth, getHighlights);
router.get('/:publicationId/page/:page', auth, getHighlightsByPage);
router.post('/', auth, createHighlight);
router.delete('/:id', auth, deleteHighlight);

module.exports = router;
