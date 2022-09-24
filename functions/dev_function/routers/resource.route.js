const express = require('express');
const {
  addResource,
  getLanguages,
  getResource,
  toggleVoteResource,
} = require('../controllers/resource.controller');
const { upload } = require('../lib/middlewares/multer.middleware');
const checkAuth = require('../lib/middlewares/auth.middleware');

const router = express.Router();

router.route('/').post(checkAuth, upload().single('image'), addResource);
router.route('/vote/:resourceId').post(checkAuth, toggleVoteResource);
router.route('/language').get(checkAuth, getLanguages);
router.route('/:languageId').get(checkAuth, getResource);
module.exports = router;
