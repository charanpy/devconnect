const express = require('express');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  getUserProjects,
  deleteProjectById,
  searchProject,
} = require('../controllers/project.controller');
const checkAuth = require('../lib/middlewares/auth.middleware');
const { upload } = require('../lib/middlewares/multer.middleware');

const router = express.Router();

router
  .route('/')
  .post(checkAuth, upload().single('image'), createProject)
  .get(checkAuth, getProjects);

router.route('/search').get(checkAuth, searchProject);
router.route('/user/:userId').get(checkAuth, getUserProjects);

router
  .route('/:projectId')
  .get(checkAuth, getProjectById)
  .patch(checkAuth, upload().single('image'), updateProject)
  .delete(checkAuth, deleteProjectById);

module.exports = router;
