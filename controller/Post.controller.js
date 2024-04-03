const PostModel = require("../Database/Models/Post.js");
const UserModel = require("../Database/Models/User.js");
const errorHandler = require("../utils/errorHandler.js");
const createPost = async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.caption || !req.body.file) {
      next(errorHandler(400, "Please Provide Title and Description"));
    }

    const newPost = new PostModel({
      title: req.body.title,
      caption: req.body.caption,
      file: req.body.file,
      user: req.user.id,
    });

    const user = await UserModel.findById(req.user.id);

    user.posts.push(newPost._id);

    await user.save();

    await newPost.save();

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    next(errorHandler(400, "Post not created"));
  }
};

// Delete Post

const deletePost = async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.query.id);

    if (!post) {
      next(errorHandler(404, "Post Not Found"));
    }
    if (post.user.toString() !== req.user.id) {
      next(errorHandler(403, "You are not authorized to delete this post"));
    }

    await PostModel.findByIdAndDelete(req.query.id);

    res.status(200).json({ success: true, data: "Post Deleted" });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

// Get All Post if user id is provided then get all post of that user and if post id is provided then get that post

// const getAllPosts = async (req, res, next) => {
//   try {
//     if (req.query.id) {
//       const post = await PostModel.findById(req.query.id);
//       if (!post) {
//         next(errorHandler(404, "Post Not Found"));
//       }
//       res.status(200).json({ success: true, data: post });
//     } else if (req.query.userId) {
//       const posts = await PostModel.find({ user: req.query.userId });
//       if (!posts) {
//         next(errorHandler(404, "Posts Not Found"));
//       }
//       res.status(200).json({ success: true, data: posts });
//     } else {
//       const posts = await PostModel.find();
//       if (!posts) {
//         next(errorHandler(404, "Posts Not Found"));
//       }
//       res.status(200).json({ success: true, data: posts });
//     }
//   } catch (error) {
//     next(errorHandler(500, "Internal Server Error"));
//   }
// };

const getAllPosts = async (req, res, next) => {
  try {
    let query;

    if (req.query.id) {
      query = { _id: req.query.id };
    } else if (req.query.userId) {
      query = { user: req.query.userId };
    } else {
      query = {};
    }

    const posts = await PostModel.find(query);

    if (!posts || posts.length === 0) {
      return next(errorHandler(404, "Posts Not Found"));
    }

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

module.exports = {
  createPost,
  deletePost,
  getAllPosts,
};
