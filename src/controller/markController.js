const { PublicationReader, Mark } = require('../models');
const APIError = require('../utils/APIError');
const APIResponse = require('../utils/APIResponse');
const asyncWrapper = require('../utils/asyncWrapper');

// GET marks for a publication (expects publicationId in req.params)
const getMarks = asyncWrapper(async (req, res) => {
    const { publicationId } = req.params;
    const userId = req.userId;
    // Check for existing PublicationReader record
    const publicationReader = await PublicationReader.findOne({ where: { userId, publicationId } });
    if (!publicationReader) {
        throw APIError.notFound('No marks found for this publication');
    }
    const marks = await Mark.findAll({ where: { publication_reader_id: publicationReader.id } });
    APIResponse.success(res, 'Marks retrieved successfully', marks);
});

// POST mark (expects publicationId, page, x, y in req.body)
const createMark = asyncWrapper(async (req, res) => {
    const { publicationId, page, x, y } = req.body;
    const userId = req.userId;
    // Find or create PublicationReader record
    const [publicationReader] = await PublicationReader.findOrCreate({
        where: { userId, publicationId },
        defaults: { userId, publicationId }
    });
    const mark = await Mark.create({
        publication_reader_id: publicationReader.id,
        page,
        x,
        y
    });
    APIResponse.created(res, 'Mark created successfully', mark);
});

// DELETE mark by mark id (expects mark id in req.params)
const deleteMark = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const mark = await Mark.findByPk(id);
    if (!mark) {
        throw APIError.notFound('Mark not found');
    }
    await mark.destroy();
    APIResponse.success(res, 'Mark deleted successfully', { id });
});

// ...existing exports if any...
module.exports = {
    getMarks,
    createMark,
    deleteMark
};
