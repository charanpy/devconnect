const express = require('express');
const {
  createPost,
  getPosts,
  updatePost,
  getUserPosts,
  deleteUserPost,
} = require('../controllers/post.controller');
const checkAuth = require('../lib/middlewares/auth.middleware');
const { upload } = require('../lib/middlewares/multer.middleware');

const router = express.Router();

router.route('/').post(upload().single('image'), createPost).get(getPosts);

router.route('/user/:userId').get(checkAuth, getUserPosts);
router
  .route('/:postId')
  .patch(upload().single('image'), updatePost)
  .delete(checkAuth, deleteUserPost);

module.exports = router;
