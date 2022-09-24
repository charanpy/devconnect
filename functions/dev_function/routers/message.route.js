const express = require('express');
const {
  addMessage,
  getGroupMessage,
  setSeen,
  getMessageNotification,
  deleteMessage,
} = require('../controllers/message.controller');
const { upload } = require('../lib/middlewares/multer.middleware');

const router = express.Router();

router.route('/').post(upload().single('image'), addMessage);
router.route('/seen').post(setSeen);
router.route('/notification/:groupId').get(getMessageNotification);
router.route('/group/:groupId').get(getGroupMessage);
router.route('/:messageId').delete(deleteMessage);
module.exports = router;
