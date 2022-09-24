const AppError = require('../lib/AppError');
const catchAsync = require('../lib/catchAsync');
const { getComment } = require('../sql/comment.sql');

const addCommentToProject = catchAsync(async (req, res, next) => {
  const { comment } = req?.body || {};

  if (!comment) return next(new AppError('Comment is required', 400));

  const dataStore = req.catalyst.datastore().table('comment');

  const newComment = await dataStore.insertRow({
    comment,
    user_id: req?.user?.id,
    project_id: req?.params?.projectId,
  });

  return res.status(201).json(newComment);
});

const addCommentToPost = catchAsync(async (req, res, next) => {
  const { comment } = req?.body || {};

  if (!comment) return next(new AppError('Comment is required', 400));

  const dataStore = req.catalyst.datastore().table('comment');

  const newComment = await dataStore.insertRow({
    comment,
    user_id: req?.user?.id,
    post_id: req?.params?.postId,
  });

  return res.status(201).json(newComment);
});

const getProjectComments = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const comments = await zcql.executeZCQLQuery(
    getComment('project_id', req?.params?.projectId)
  );

  return res.status(200).json(comments);
});

const getPostComments = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const comments = await zcql.executeZCQLQuery(
    getComment('post_id', req?.params?.postId)
  );

  return res.status(200).json(comments);
});

module.exports = {
  addCommentToPost,
  addCommentToProject,
  getProjectComments,
  getPostComments,
};
