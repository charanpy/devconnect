const express = require('express');
const {
  addPrivateGroup,
  getUserGroup,
} = require('../controllers/group.controller');

const router = express.Router();

router.route('/').post(addPrivateGroup).get(getUserGroup);
module.exports = router;
