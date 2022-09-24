const AppError = require('../lib/AppError');
const catchAsync = require('../lib/catchAsync');
const {
  uploadFileToCatalyst,
  deleteFileCatalyst,
} = require('../lib/filestore');
const {
  selectQuerySQL,
  updateQuerySQL,
  deleteQuerySQL,
} = require('../sql/helper');
const { getPostSQL, getUserPost } = require('../sql/post.sql');

const createPost = catchAsync(async (req, res, next) => {
  const { tags, description } = req?.body || {};

  console.log(req?.body, req?.file);

  if (!req?.user?.id || !tags || !description || !req.file)
    return next(new AppError('Please fill all fields', 400));

  const media = await uploadFileToCatalyst(req, process.env.PROJECT_FILE_ID);

  const project = req.catalyst.datastore().table('Post');

  const result = await project.insertRow({
    user_id: req?.user?.id,
    media: media,
    tags,
    description,
  });

  return res.status(200).json(result);
});

const getPosts = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const posts = await zcql.executeZCQLQuery(getPostSQL);

  return res.status(200).json(posts);
});

const updatePost = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const post = await zcql.executeZCQLQuery(
    selectQuerySQL('POST', req?.params?.postId)
  );

  if (!post || !post?.length)
    return next(new AppError('No Project Found', 404));

  if (req?.file && post?.[0]?.Post?.media) {
    await deleteFileCatalyst(req, post?.[0]?.Post?.media);
    req.body['media'] = await uploadFileToCatalyst(
      req,
      process.env.POST_FILE_ID
    );
  }
  const updatedPost = await zcql.executeZCQLQuery(
    updateQuerySQL('POST', req?.params?.postId, req?.body, 'ROWID')
  );
  return res.status(200).json(updatedPost);
});

const getUserPosts = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const posts = await zcql.executeZCQLQuery(getUserPost(req?.params?.userId));

  return res.status(200).json(posts);
});

const deleteUserPost = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const post = await zcql.executeZCQLQuery(
    selectQuerySQL('POST', req?.params?.postId, req?.user?.user_id)
  );

  if (!post || !post?.length)
    return next(new AppError('No Project Found', 404));

  if (post?.[0]?.Post?.media)
    await deleteFileCatalyst(req, post?.[0]?.Post?.media);

  await zcql.executeZCQLQuery(
    deleteQuerySQL('POST', req?.params?.postId, req?.user?.user_id)
  );

  return res.status(200).json('Deleted Project');
});

module.exports = {
  createPost,
  getPosts,
  getUserPosts,
  updatePost,
  deleteUserPost,
};
