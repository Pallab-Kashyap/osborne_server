const { Note, PublicationReader, sequelize } = require('../models');
const asyncWrapper = require('../utils/asyncWrapper');
const ApiError = require('../utils/APIError');
const APIResponse = require('../utils/APIResponse');

const getNotes = asyncWrapper(async (req, res) => {
    const { user_id, publication_id } = req.body;

    if (!user_id || !publication_id) {
        throw ApiError.badRequest('User ID and Publication ID are required');
    }

    const notes = await Note.findAll({
        where: { 
            id: user_id,
            publication_id: publication_id 
        },
        order: [['page', 'ASC']]
    });

    return APIResponse.success(
        res, 
        notes.length ? 'Notes retrieved successfully' : 'No notes found',
        notes
    );
});

const createNote = asyncWrapper(async (req, res) => {
    const { user_id, publication_id, page, x, y, color, text } = req.body;

    if (!user_id || !publication_id || !page || x === undefined || y === undefined || !color) {
        throw ApiError.badRequest('Missing required fields');
    }

    const result = await sequelize.transaction(async (t) => {
        const syncItem = await PublicationReader.create({
            userId: user_id,
            publicationId: publication_id
        }, { transaction: t });

        const note = await Note.create({
            id: user_id,
            publication_id,
            page,
            x,
            y,
            color,
            text
        }, { transaction: t });

        return { note, sync_id: syncItem.id };
    });

    return APIResponse.success(res, 'Note created successfully', result);
});

const deleteNote = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const { publication_id } = req.body;

    if (!id || !publication_id) {
        throw ApiError.badRequest('Note ID and Publication ID are required');
    }

    const note = await Note.findOne({
        where: {
            id,
            publication_id
        }
    });
    
    if (!note) {
        throw ApiError.notFound('Note not found');
    }

    await note.destroy();

    return APIResponse.success(res, 'Note deleted successfully', { id });
});

module.exports = {
    getNotes,
    createNote,
    deleteNote
};
