const express = require('express');
const {
  addCommentToProject,
  addCommentToPost,
  getProjectComments,
  getPostComments,
} = require('../controllers/comment.controller');

const router = express.Router();

router
  .route('/project/:projectId')
  .post(addCommentToProject)
  .get(getProjectComments);
router.route('/post/:postId').post(addCommentToPost).get(getPostComments);

module.exports = router;
