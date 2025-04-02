const { Bookmark, PublicationReader } = require("../models/index");
const asyncWrapper = require("../utils/asyncWrapper");
const ApiError = require("../utils/APIError");
const APIResponse = require("../utils/APIResponse");

/**
 * Get bookmarks for a user and publication
 */
const getBookmarks = asyncWrapper(async (req, res) => {
  const { publication_id } = req.body;
  const userId = req.userId;

  const queryCondition = { userId };
  if (publication_id) {
    queryCondition.publicationId = publication_id;
  }

  // Find publication readers matching the criteria
  const publicationReaders = await PublicationReader.findAll({
    where: queryCondition,
    include: [{
      model: Bookmark,
      required: false // Use left join to get readers even if they don't have bookmarks
    }]
  });


  // Extract bookmarks from the results
  const bookmarks = [];
  publicationReaders.forEach(pr => {
    if (pr.Bookmark) {
      bookmarks.push({
        id: pr.id,
        publication_id: pr.publicationId,
        page: pr.Bookmark.page,
        created_at: pr.createdAt
      });
    }
  });

  return APIResponse.success(res, "Bookmarks retrieved successfully", { bookmarks });
});

/**
 * Create or update a bookmark
 */
const createBookmark = asyncWrapper(async (req, res) => {
  const { page, publication_id } = req.body;
  const userId = req.userId;

  if (!page || !publication_id) {
    throw ApiError.badRequest("Missing required fields: page and publication_id are required");
  }

  // First check if publication reader already exists for this publication and user
  let publicationReader = await PublicationReader.findOne({
    where: {
      userId,
      publicationId: publication_id
    }
  });

  // If publication reader doesn't exist, create it
  if (!publicationReader) {
    publicationReader = await PublicationReader.create({
      userId,
      publicationId: publication_id
    });
  }

  // Check if bookmark already exists for this publication reader
  let bookmark = await Bookmark.findOne({
    where: { publicationReaderId: publicationReader.id }
  });

  let message = "Bookmark created successfully";
  if (bookmark) {
    // If exists, update the bookmark
    bookmark.page = page;
    await bookmark.save();
    message = "Bookmark updated successfully";
  } else {
    // If not exists, create new
    bookmark = await Bookmark.create({
      publicationReaderId: publicationReader.id,
      page
    });
  } 

  return APIResponse.success(res, message, {
    data: {
      id: publicationReader.id,
      publication_id,
      page: bookmark.page
    },
    sync_id: publicationReader.id
  });
});

/**
 * Delete a bookmark
 */
const deleteBookmark = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!id) {
    throw ApiError.badRequest("Bookmark ID is required");
  }

  // Verify ownership before deletion
  const bookmark = await Bookmark.findOne({
    where: { id },
    include: [{
      model: PublicationReader,
      where: { userId }
    }]
  });

  if (!bookmark) {
    throw ApiError.notFound("Bookmark not found or unauthorized");
  }

  await bookmark.destroy();

  return APIResponse.success(res, "Bookmark deleted successfully", { id });
});

module.exports = {
  getBookmarks,
  createBookmark,
  deleteBookmark
};