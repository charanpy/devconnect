const AppError = require('../lib/AppError');
const catchAsync = require('../lib/catchAsync');
const {
  uploadFileToCatalyst,
  deleteFileCatalyst,
} = require('../lib/filestore');

const editProfile = catchAsync(async (req, res, next) => {
  const profile = req.catalyst.datastore().table('profile');

  console.log(req?.body);

  const isProfile = await profile.getRow(req?.user?.user_id);

  if (!isProfile) return next(new AppError('Profile not found', 404));

  if (req?.file) {
    req.body['media'] = await uploadFileToCatalyst(
      req,
      process.env.POST_FILE_ID
    );
  }

  if (req?.file && isProfile?.media) {
    await deleteFileCatalyst(req, isProfile?.media);
  }
  req.body['ROWID'] = req?.user?.user_id;
  const updatedProfile = await profile.updateRow(req?.body || {});

  return res.status(200).json(updatedProfile);
});

const getProfiles = catchAsync(async (req, res, next) => {
  const profile = await req.catalyst
    .datastore()
    .table('9044000000015553')
    .getPagedRows({ nextToken: undefined, maxRows: 100 });

  return res.status(200).json(profile?.data || []);
});

const getProfileById = catchAsync(async (req, res, next) => {
  const profile = req.catalyst.datastore().table('profile');

  const result = await profile.getRow(req?.params?.profileId);

  return res.status(200).json(result);
});

const getMe = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  console.log(req.user);
  const profile = await zcql.executeZCQLQuery(
    `SELECT * FROM PROFILE WHERE ROWID=${req?.user?.user_id}`
  );

  return res.status(200).json(profile);
});

module.exports = {
  editProfile,
  getProfiles,
  getProfileById,
  getMe,
};
