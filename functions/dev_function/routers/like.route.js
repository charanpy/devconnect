const express = require('express');
const {
  toggleLikeProject,
  toggleLikePost,
  getProjectLike,
  getPostLike,
} = require('../controllers/like.controller');

const router = express.Router();

router.route('/project/:projectId').post(toggleLikeProject).get(getProjectLike);
router.route('/post/:postId').post(toggleLikePost).get(getPostLike);

module.exports = router;
