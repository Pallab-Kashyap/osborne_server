// const { Note, PublicationReader, sequelize } = require('../models');
// const asyncWrapper = require('../utils/asyncWrapper');
// const ApiError = require('../utils/APIError');
// const APIResponse = require('../utils/APIResponse');

// const getNotes = asyncWrapper(async (req, res) => {
//     const { user_id, publication_id } = req.body;

//     if (!user_id || !publication_id) {
//         throw ApiError.badRequest('User ID and Publication ID are required');
//     }

//     const notes = await Note.findAll({
//         where: { 
//             id: user_id,
//             publication_id: publication_id 
//         },
//         order: [['page', 'ASC']]
//     });

//     return APIResponse.success(
//         res, 
//         notes.length ? 'Notes retrieved successfully' : 'No notes found',
//         notes
//     );
// });

// const createNote = asyncWrapper(async (req, res) => {
//     const { user_id, publication_id, page, x, y, color, text } = req.body;

//     if (!user_id || !publication_id || !page || x === undefined || y === undefined || !color) {
//         throw ApiError.badRequest('Missing required fields');
//     }

//     const result = await sequelize.transaction(async (t) => {
//         const syncItem = await PublicationReader.create({
//             userId: user_id,
//             publicationId: publication_id
//         }, { transaction: t });

//         const note = await Note.create({
//             id: user_id,
//             publication_id,
//             page,
//             x,
//             y,
//             color,
//             text
//         }, { transaction: t });

//         return { note, sync_id: syncItem.id };
//     });

//     return APIResponse.success(res, 'Note created successfully', result);
// });

// const deleteNote = asyncWrapper(async (req, res) => {
//     const { id } = req.params;
//     const { publication_id } = req.body;

//     if (!id || !publication_id) {
//         throw ApiError.badRequest('Note ID and Publication ID are required');
//     }

//     const note = await Note.findOne({
//         where: {
//             id,
//             publication_id
//         }
//     });
    
//     if (!note) {
//         throw ApiError.notFound('Note not found');
//     }

//     await note.destroy();

//     return APIResponse.success(res, 'Note deleted successfully', { id });
// });

// module.exports = {
//     getNotes,
//     createNote,
//     deleteNote
// };
const { Note, PublicationReader, sequelize } = require('../models');
const asyncWrapper = require('../utils/asyncWrapper');
const ApiError = require('../utils/APIError');
const APIResponse = require('../utils/APIResponse');

/**
 * Get notes for a user and publication
 */
const getNotes = asyncWrapper(async (req, res) => {
    const { user_id, publication_id } = req.body;

    if (!user_id || !publication_id) {
        throw ApiError.badRequest('User ID and Publication ID are required');
    }

    // First find all publication readers for this user and publication
    const publicationReaders = await PublicationReader.findAll({
        where: { 
            userId: user_id,
            publicationId: publication_id 
        }
    });

    // Extract IDs to use in note query
    const readerIds = publicationReaders.map(pr => pr.id);
    
    if (readerIds.length === 0) {
        return APIResponse.success(res, 'No notes found', []);
    }

    // Find notes with these reader IDs
    const notes = await Note.findAll({
        where: { 
            id: readerIds
        },
        order: [['page', 'ASC']]
    });

    // Format the response data
    const formattedNotes = notes.map(note => ({
        id: note.id,
        publication_id: note.publication_id,
        page: note.page,
        x: note.x,
        y: note.y,
        color: note.color,
        text: note.text
    }));

    return APIResponse.success(
        res, 
        notes.length ? 'Notes retrieved successfully' : 'No notes found',
        formattedNotes
    );
});

/**
 * Create a note
 */
const createNote = asyncWrapper(async (req, res) => {
    const { user_id, publication_id, page, x, y, color, text } = req.body;

    if (!user_id || !publication_id || !page || x === undefined || y === undefined || !color) {
        throw ApiError.badRequest('Missing required fields');
    }

    const result = await sequelize.transaction(async (t) => {
        // Create a publication reader entry to associate user with publication
        const publicationReader = await PublicationReader.findOrCreate({
            where: {
                userId: user_id,
                publicationId: publication_id
            },
            defaults: {
                userId: user_id,
                publicationId: publication_id
            },
            transaction: t
        });

        // Use the publication reader ID as the note ID
        const note = await Note.create({
            id: publicationReader[0].id, // Using the first result from findOrCreate
            publication_id,
            page,
            x,
            y,
            color,
            text: text || '' // Ensure text is not null
        }, { transaction: t });

        return { 
            note: {
                id: note.id,
                publication_id: note.publication_id,
                page: note.page,
                x: note.x,
                y: note.y,
                color: note.color,
                text: note.text
            }, 
            sync_id: publicationReader[0].id 
        };
    });

    return APIResponse.success(res, 'Note created successfully', result);
});

/**
 * Update a note
 */
const updateNote = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const { publication_id, page, x, y, color, text } = req.body;

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

    // Update fields that were provided
    if (page !== undefined) note.page = page;
    if (x !== undefined) note.x = x;
    if (y !== undefined) note.y = y;
    if (color !== undefined) note.color = color;
    if (text !== undefined) note.text = text;

    await note.save();

    return APIResponse.success(res, 'Note updated successfully', { 
        id: note.id,
        publication_id: note.publication_id,
        page: note.page,
        x: note.x,
        y: note.y,
        color: note.color,
        text: note.text
    });
});

/**
 * Delete a note
 */
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
    updateNote,
    deleteNote
};