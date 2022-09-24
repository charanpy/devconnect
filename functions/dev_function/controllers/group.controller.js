const AppError = require('../lib/AppError');
const catchAsync = require('../lib/catchAsync');
const { getPublicGroupSQL } = require('../sql/group.sql');

const addPrivateGroup = catchAsync(async (req, res) => {
  const { user2 } = req?.body || {};

  if (!user2) return next(new AppError('User is required', 400));

  const zcql = req.catalyst.zcql();

  const isGroup = await zcql.executeZCQLQuery(
    getPublicGroupSQL(req?.user?.id, user2)
  );

  if (isGroup && isGroup?.length)
    return res.status(200).json(isGroup?.[0]?.Groups);

  const dataStore = req.catalyst.datastore().table('groups');

  const newGroup = await dataStore.insertRow({
    user1: req?.user?.id,
    user2,
    group_name: 'private',
    type: 'private',
  });

  return res.status(201).json(newGroup);
});

const getUserGroup = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const groups = await zcql.executeZCQLQuery(
    `SELECT * FROM GROUPS WHERE user1='${req?.user?.id}' OR user2='${req?.user?.id}'`
  );

  return res.status(200).json(groups);
});

module.exports = {
  addPrivateGroup,
  getUserGroup,
};
