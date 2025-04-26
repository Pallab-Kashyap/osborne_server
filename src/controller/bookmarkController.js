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
    // Check if Bookmarks array is non-empty
    if (pr.Bookmarks && pr.Bookmarks.length > 0) {
      pr.Bookmarks.forEach(bookmark => {
        bookmarks.push({
          id: bookmark.id,
          publication_id: pr.publicationId,
          page: bookmark.page,
          created_at: pr.createdAt
        });
      });
    }
  });

  // Filter out duplicate bookmarks based on 'page'
  const unique = {};
  const uniqueBookmarks = [];
  bookmarks.forEach(b => {
    if (!unique[b.page]) {
      unique[b.page] = true;
      uniqueBookmarks.push(b);
    }
  });

  return APIResponse.success(res, "Bookmarks retrieved successfully", { bookmarks: uniqueBookmarks });
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

  try {
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

    // Check if a bookmark with the same page already exists for this publicationReader
    const existingBookmark = await Bookmark.findOne({
      where: {
        publicationReaderId: publicationReader.id,
        page
      }
    });
    if (existingBookmark) {
      return APIResponse.success(res, "Bookmark already exists", {
        data: {
          id: existingBookmark.id,
          publication_id,
          page: existingBookmark.page
        }
      });
    }

    // Create new bookmark
    const bookmark = await Bookmark.create({
      publicationReaderId: publicationReader.id,
      page
    });

    return APIResponse.success(res, "Bookmark created successfully", {
      data: {
        id: bookmark.id,
        publication_id,
        page: bookmark.page
      },
    });
  } catch (error) {
    throw ApiError.internal("Failed to create bookmark", error);
  }
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