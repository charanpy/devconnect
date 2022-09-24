const express = require('express');
const {
  editProfile,
  getProfiles,
  getProfileById,
  getMe,
} = require('../controllers/profile.controller');
const checkAuth = require('../lib/middlewares/auth.middleware');
const { upload } = require('../lib/middlewares/multer.middleware');

const router = express.Router();

router
  .route('/')
  .get(getProfiles)
  .patch(checkAuth, upload().single('image'), editProfile);
router.route('/me').get(checkAuth, getMe);
router
  .route('/:profileId')

  .get(getProfileById);

module.exports = router;
