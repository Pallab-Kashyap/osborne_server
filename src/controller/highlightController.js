const { PublicationReader, Highlight } = require('../models');
const APIError = require('../utils/APIError');
const APIResponse = require('../utils/APIResponse');
const asyncWrapper = require('../utils/asyncWrapper');
const { Op } = require('sequelize');

const getHighlights = asyncWrapper(async (req, res) => {
    const { publicationId } = req.params;
    const userId = req.userId; 

    const publicationReader = await PublicationReader.findOne({
        where: { userId, publicationId }
    });

    if (!publicationReader) {
        throw APIError.notFound('No highlights found for this publication');
    }

    const highlights = await Highlight.findAll({
        where: { publication_reader_id: publicationReader.id }
    });

    APIResponse.success(res, 'Highlights retrieved successfully', highlights);
});

const getHighlightsByPage = asyncWrapper(async (req, res) => {
    const { publicationId, page } = req.params;
    const userId = req.userId; 

    const publicationReader = await PublicationReader.findOne({
        where: { userId, publicationId }
    });

    if (!publicationReader) {
        throw APIError.notFound('No highlights found for this publication');
    }

    const highlights = await Highlight.findAll({
        where: {
            publication_reader_id: publicationReader.id,
            pageNumber: { [Op.contains]: [parseInt(page, 10)] }
        }
    });

    APIResponse.success(res, 'Highlights for page retrieved successfully', highlights);
});

const createHighlight = asyncWrapper(async (req, res) => {
    let { publicationId, pageNumber, x, y, height, width, text } = req.body;
    const userId = req.userId; // Assuming you have user in request from auth middleware

    // Convert fields to arrays if they are not already.
    x = Array.isArray(x) ? x : [x];
    y = Array.isArray(y) ? y : [y];
    height = Array.isArray(height) ? height : [height];
    width = Array.isArray(width) ? width : [width];
    pageNumber = Array.isArray(pageNumber) ? pageNumber : [pageNumber];
    if (text !== undefined && text !== null) {
        text = Array.isArray(text) ? text : [text];
    }

    // Find or create PublicationReader record
    const [publicationReader] = await PublicationReader.findOrCreate({
        where: { userId, publicationId },
        defaults: { userId, publicationId }
    });

    const highlight = await Highlight.create({
        publication_reader_id: publicationReader.id,
        pageNumber,
        x,
        y,
        height,
        width,
        text
    });

    APIResponse.created(res, 'Highlight created successfully', highlight);
});

const deleteHighlight = asyncWrapper(async (req, res) => {
    const { id } = req.params;

    const highlight = await Highlight.findByPk(id);
    if (!highlight) {
        throw APIError.notFound('Highlight not found');
    }

    await highlight.destroy();
    APIResponse.success(res, 'Highlight deleted successfully', { id });
});

module.exports = {
    getHighlights,
    getHighlightsByPage,
    createHighlight,
    deleteHighlight
};

