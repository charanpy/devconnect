const express = require('express');
const {
  addCommentToProject,
  addCommentToPost,
  getProjectComments,
  getPostComments,
} = require('../controllers/comment.controller');
const checkAuth = require('../lib/middlewares/auth.middleware');

const router = express.Router();

router
  .route('/project/:projectId')
  .post(checkAuth, addCommentToProject)
  .get(checkAuth, getProjectComments);
router
  .route('/post/:postId')
  .post(checkAuth, addCommentToPost)
  .get(checkAuth, getPostComments);

module.exports = router;
