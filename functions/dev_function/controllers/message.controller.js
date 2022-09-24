const AppError = require('../lib/AppError');
const catchAsync = require('../lib/catchAsync');
const {
  uploadFileToCatalyst,
  deleteFileCatalyst,
} = require('../lib/filestore');
const {
  checkUserInGroupSQL,
  getGroupMessageSQL,
  setSeenSQL,
  messageNotificationSQL,
  getUserMessageSQL,
  deleteMessageSQL,
} = require('../sql/group.sql');

const addMessage = catchAsync(async (req, res, next) => {
  const { message, groupId, receiver } = req?.body || {};

  if (!(message || req?.file || groupId))
    return next(new AppError('Message is required', 400));

  let media = '';
  if (req?.file)
    media = await uploadFileToCatalyst(req, process.env.MESSAGE_FILE_ID);

  const dataStore = req.catalyst.datastore().table('message');

  const newMessage = await dataStore.insertRow({
    message,
    media,
    user_id: req?.user?.id,
    group_id: groupId,
    receiver,
  });

  return res.status(201).json(newMessage);
});

const getGroupMessage = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const isUserInGroup = await zcql.executeZCQLQuery(
    checkUserInGroupSQL(req?.params?.groupId, req?.user?.id)
  );

  if (!isUserInGroup || !isUserInGroup?.length)
    return next(new AppError('Not Authorized', 400));

  const messages = await zcql.executeZCQLQuery(
    getGroupMessageSQL(req?.params?.groupId)
  );

  return res.status(200).json(messages);
});

const setSeen = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  await zcql.executeZCQLQuery(setSeenSQL(req?.body?.groupId, req?.user?.id));

  return res.status(200).json('Status updated');
});

const getMessageNotification = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();
  const messages = await zcql.executeZCQLQuery(
    messageNotificationSQL(req?.params?.groupId, req?.user?.id)
  );

  return res.status(200).json(messages);
});

const deleteMessage = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const message = await zcql.executeZCQLQuery(
    getUserMessageSQL(req?.params?.messageId, req?.user?.id)
  );

  if (!message || !message?.length)
    return next(new AppError('Message not found', 404));

  if (message?.[0]?.Message?.media)
    await deleteFileCatalyst(req, message?.[0]?.Message?.media);

  await zcql.executeZCQLQuery(deleteMessageSQL(req?.params?.messageId));

  return res.status(200).json('Message deleted');
});

module.exports = {
  addMessage,
  getGroupMessage,
  setSeen,
  getMessageNotification,
  deleteMessage,
};
