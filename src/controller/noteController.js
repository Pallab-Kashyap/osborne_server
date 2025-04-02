
const { Note, PublicationReader, sequelize } = require('../models');
const asyncWrapper = require('../utils/asyncWrapper');
const ApiError = require('../utils/APIError');
const APIResponse = require('../utils/APIResponse');

/**
 * Get notes for a user and publication
 */
const getNotes = asyncWrapper(async (req, res) => {
    // Check both query parameters and request body for publication_id
    const publication_id = req.query.publication_id || req.body.publication_id;
    const userId = req.userId; // From auth middleware

    if (!publication_id) {
        throw ApiError.badRequest('Publication ID is required');
    }

    // Find publication readers matching the criteria
    const publicationReaders = await PublicationReader.findAll({
        where: { 
            userId,
            publicationId: publication_id 
        },
        include: [{
            model: Note,
            required: false
        }]
    });

    // Extract notes from the results
    const notes = [];
    publicationReaders.forEach(pr => {
        if (pr.Note) {
            notes.push({
                id: pr.Note.id,
                publication_id: pr.publicationId,
                page: pr.Note.page,
                x: pr.Note.x,
                y: pr.Note.y,
                color: typeof pr.Note.color === 'bigint' ? pr.Note.color.toString() : pr.Note.color,
                text: pr.Note.text,
                created_at: pr.Note.createdAt || pr.createdAt
            });
        }
    });

    return APIResponse.success(
        res, 
        notes.length ? 'Notes retrieved successfully' : 'No notes found',
        notes
    );
});

/**
 * Create a note
 */
const createNote = asyncWrapper(async (req, res) => {
    const { publication_id, page, x, y, color, text } = req.body;
    const userId = req.userId; // From auth middleware

    // Improved validation
    if (!publication_id) {
        throw ApiError.badRequest('Publication ID is required');
    }
    if (!page || page < 0) {
        throw ApiError.badRequest('Valid page number is required');
    }
    if (typeof x !== 'number' && isNaN(parseFloat(x))) {
        throw ApiError.badRequest('Valid x coordinate is required');
    }
    if (typeof y !== 'number' && isNaN(parseFloat(y))) {
        throw ApiError.badRequest('Valid y coordinate is required');
    }
    if (!color) {
        throw ApiError.badRequest('Color is required');
    }

    try {
        const result = await sequelize.transaction(async (t) => {
            // First create the PublicationReader if it doesn't exist
            const [publicationReader] = await PublicationReader.findOrCreate({
                where: {
                    userId,
                    publicationId: publication_id
                },
                defaults: {
                    userId,
                    publicationId: publication_id
                },
                transaction: t
            });

            // Create the note with explicit values
            const note = await Note.create({
                publicationReaderId: publicationReader.id,
                publication_id,
                page: parseInt(page),
                x: parseFloat(x),
                y: parseFloat(y),
                color: BigInt(color),
                text: text || '' // Ensure text is not null
            }, { transaction: t });

            return { 
                note: {
                    id: note.id,
                    publication_id: note.publication_id,
                    page: note.page,
                    x: note.x,
                    y: note.y,
                    color: note.color.toString(), // Convert BigInt to string
                    text: note.text,
                    created_at: note.createdAt
                }
            };
        });

        return APIResponse.success(res, 'Note created successfully', result);
    } catch (error) {
        console.error('Note creation error:', error);
        throw ApiError.internal('Failed to create note', error);
    }
});

/**
 * Update a note
 */
// const updateNote = asyncWrapper(async (req, res) => {
//     const { id } = req.params;
//     const { publication_id, page, x, y, color, text } = req.body;
//     const userId = req.userId; // From auth middleware

//     if (!id) {
//         throw ApiError.badRequest('Note ID is required');
//     }
    
//     if (!publication_id) {
//         throw ApiError.badRequest('Publication ID is required');
//     }

//     // Verify ownership before updating
//     const note = await Note.findOne({
//         where: { id },
//         include: [{
//             model: PublicationReader,
//             where: { userId }
//         }]
//     });
    
//     if (!note) {
//         throw ApiError.notFound('Note not found or unauthorized');
//     }

//     // Update fields that were provided
//     if (page !== undefined) note.page = parseInt(page);
//     if (x !== undefined) note.x = parseFloat(x);
//     if (y !== undefined) note.y = parseFloat(y);
//     if (color !== undefined) note.color = BigInt(color);
//     if (text !== undefined) note.text = text;

//     await note.save();

//     return APIResponse.success(res, 'Note updated successfully', { 
//         id: note.id,
//         publication_id: note.publication_id,
//         page: note.page,
//         x: note.x,
//         y: note.y,
//         color: note.color.toString(), // Convert BigInt to string
//         text: note.text
//     });
// });
const updateNote = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const { text, page, x, y, color } = req.body;
    const userId = req.userId;
    
    if (!id) {
        throw ApiError.badRequest('Note ID is required');
    }
    
    // Verify ownership
    const note = await Note.findOne({
        where: { id },
        include: [{
            model: PublicationReader,
            where: { userId }
        }]
    });
    
    if (!note) {
        throw ApiError.notFound('Note not found or unauthorized');
    }
    
    // Only update fields that were provided
    const updates = {};
    if (page !== undefined) updates.page = parseInt(page);
    if (x !== undefined) updates.x = parseFloat(x);
    if (y !== undefined) updates.y = parseFloat(y);
    if (color !== undefined) updates.color = BigInt(color);
    if (text !== undefined) updates.text = text;
    
    await note.update(updates);
    
    // Return the updated note
    return APIResponse.success(res, 'Note updated successfully', {
        id: note.id,
        publication_id: note.publication_id,
        page: note.page,
        x: note.x,
        y: note.y,
        color: note.color.toString(),
        text: note.text
    });
});
/**
 * Delete a note
 */
const deleteNote = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const userId = req.userId; // From auth middleware

    if (!id) {
        throw ApiError.badRequest('Note ID is required');
    }

    // Verify ownership before deletion
    const note = await Note.findOne({
        where: { id },
        include: [{
            model: PublicationReader,
            where: { userId }
        }]
    });
    
    if (!note) {
        throw ApiError.notFound('Note not found or unauthorized');
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