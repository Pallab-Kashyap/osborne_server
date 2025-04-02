const express = require('express');
const router = express.Router();
const markController = require('../controller/markController');
const auth = require('../middleware/auth');

// ...existing middleware/routes if any...

// GET marks for a publication
router.get('/:publicationId',auth, markController.getMarks);

// POST new mark
router.post('/',auth, markController.createMark);

// DELETE a mark
router.delete('/:id',auth, markController.deleteMark);

// ...existing exports or code...
module.exports = router;
