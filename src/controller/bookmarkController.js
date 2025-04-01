// const { Bookmark, PublicationReader } = require("../models/index");
// const asyncWrapper = require("../utils/asyncWrapper");
// const ApiError = require("../utils/APIError");
// const APIResponse = require("../utils/APIResponse");

// const getBookmark = asyncWrapper(async (req, res) => {
//   const { user_id } = req.body;

//   if (!user_id) {
//     throw ApiError.badRequest("User ID is required");
//   }

//   const bookmarks = await Bookmark.findAll({
//     where: { id: user_id }
//   });

//   return APIResponse.success(res, "Bookmarks retrieved successfully", { data: bookmarks });
// });

// const createBookmark = asyncWrapper(async (req, res) => {
//   const { user_id, page, publication_id } = req.body;

//   if (!user_id || !page || !publication_id) {
//     throw ApiError.badRequest("Missing required fields: user_id, page, and publication_id are required");
//   }

//   // First check if bookmark already exists for this publication and user
//   const existingPublicationReader = await PublicationReader.findOne({
//     where: {
//       userId: user_id,
//       publicationId: publication_id
//     }
//   });

//   if (existingPublicationReader) {
//     // If exists, update the bookmark
//     const existingBookmark = await Bookmark.findOne({
//       where: { id: existingPublicationReader.id }
//     });

//     if (existingBookmark) {
//       existingBookmark.page = page;
//       await existingBookmark.save();
//       return APIResponse.success(res, "Bookmark updated successfully", {
//         data: existingBookmark,
//         sync_id: existingPublicationReader.id
//       });
//     }
//   }

//   // If not exists, create new
//   const publicationReader = await PublicationReader.create({
//     userId: user_id,
//     publicationId: publication_id
//   });

//   const bookmark = await Bookmark.create({
//     id: publicationReader.id,
//     page
//   });

//   return APIResponse.success(res, "Bookmark created successfully", {
//     data: bookmark,
//     sync_id: publicationReader.id
//   });
// });

// const deleteBookmark = asyncWrapper(async (req, res) => {
//   const { id } = req.params;

//   const bookmark = await Bookmark.destroy({
//     where: { id }
//   });

//   if (!bookmark) {
//     throw ApiError.notFound("Bookmark not found");
//   }

//   return APIResponse.success(res, "Bookmark deleted successfully", { id });
// });

// module.exports = {
//   getBookmark,
//   createBookmark,
//   deleteBookmark
// };
const { Bookmark, PublicationReader } = require("../models/index");
const asyncWrapper = require("../utils/asyncWrapper");
const ApiError = require("../utils/APIError");
const APIResponse = require("../utils/APIResponse");

/**
 * Get bookmarks for a user and publication
 */
const getBookmarks = asyncWrapper(async (req, res) => {
  const { user_id, publication_id } = req.body;

  if (!user_id) {
    throw ApiError.badRequest("User ID is required");
  }

  // If publication_id is provided, filter by it
  const queryCondition = { userId: user_id };
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
  const { user_id, page, publication_id } = req.body;

  if (!user_id || !page || !publication_id) {
    throw ApiError.badRequest("Missing required fields: user_id, page, and publication_id are required");
  }

  // First check if publication reader already exists for this publication and user
  let publicationReader = await PublicationReader.findOne({
    where: {
      userId: user_id,
      publicationId: publication_id
    }
  });

  // If publication reader doesn't exist, create it
  if (!publicationReader) {
    publicationReader = await PublicationReader.create({
      userId: user_id,
      publicationId: publication_id
    });
  }

  // Check if bookmark already exists for this publication reader
  let bookmark = await Bookmark.findOne({
    where: { id: publicationReader.id }
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
      id: publicationReader.id,
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

  if (!id) {
    throw ApiError.badRequest("Bookmark ID is required");
  }

  const bookmark = await Bookmark.findOne({
    where: { id }
  });

  if (!bookmark) {
    throw ApiError.notFound("Bookmark not found");
  }

  await bookmark.destroy();

  return APIResponse.success(res, "Bookmark deleted successfully", { id });
});

module.exports = {
  getBookmarks,
  createBookmark,
  deleteBookmark
};