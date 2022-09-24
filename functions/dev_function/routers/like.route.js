const express = require('express');
const {
  toggleLikeProject,
  toggleLikePost,
  getProjectLike,
  getPostLike,
} = require('../controllers/like.controller');
const checkAuth = require('../lib/middlewares/auth.middleware');

const router = express.Router();

router
  .route('/project/:projectId')
  .post(checkAuth, toggleLikeProject)
  .get(checkAuth, getProjectLike);
router
  .route('/post/:postId')
  .post(checkAuth, toggleLikePost)
  .get(checkAuth, getPostLike);

module.exports = router;
