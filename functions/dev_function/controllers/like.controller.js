const catchAsync = require('../lib/catchAsync');
const { getLikeSQL, deleteLikeSQL, getLikesSQL } = require('../sql/like.sql');

const toggleLikeProject = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  console.log(
    getLikeSQL(
      'project',
      req?.user?.user_id,
      'project_id',
      req?.params?.projectId
    )
  );
  const isLiked = await zcql.executeZCQLQuery(
    getLikeSQL(
      'project',
      req?.user?.user_id,
      'project_id',
      req?.params?.projectId
    )
  );
  console.log(isLiked);

  if (isLiked?.length) {
    await zcql.executeZCQLQuery(
      deleteLikeSQL(req?.params?.projectId, req?.user?.user_id, 'project_id')
    );
    return res.status(200).json('Unlike');
  }

  const dataStore = req.catalyst.datastore().table('likes');

  const like = await dataStore.insertRow({
    user_id: req?.user?.user_id,
    project_id: req?.params?.projectId,
  });

  return res.status(201).json(like);
});

const toggleLikePost = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const isLiked = await zcql.executeZCQLQuery(
    getLikeSQL('post', req?.user?.user_id, 'post_id', req?.params?.postId)
  );

  if (isLiked?.length) {
    await zcql.executeZCQLQuery(
      deleteLikeSQL(req?.params?.postId, req?.user?.user_id, 'post_id')
    );
    return res.status(200).json('Unlike');
  }

  const dataStore = req.catalyst.datastore().table('likes');

  const like = await dataStore.insertRow({
    type: 'post',
    user_id: req?.user?.user_id,
    post_id: req?.params?.postId,
  });

  return res.status(201).json(like);
});

const getProjectLike = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const users = await zcql.executeZCQLQuery(
    getLikesSQL('project_id', req?.params?.projectId)
  );

  return res.status(200).json(users);
});

const getPostLike = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const users = await zcql.executeZCQLQuery(
    getLikesSQL('post_id', req?.params?.postId)
  );

  return res.status(200).json(users);
});

module.exports = {
  toggleLikeProject,
  toggleLikePost,
  getPostLike,
  getProjectLike,
};
