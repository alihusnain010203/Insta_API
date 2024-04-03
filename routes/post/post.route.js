const express = require('express');
const {createPost,getAllPosts, deletePost}=require("../../controller/Post.controller.js")
const verifyUser=require("../../utils/verifyUser.js")
const router = express.Router();

router.post("/createPost",verifyUser,createPost);
router.delete("/deletePost",verifyUser,deletePost);
router.post("/getallpost",getAllPosts);






module.exports = router;