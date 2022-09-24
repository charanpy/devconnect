const AppError = require('../AppError');
const catchAsync = require('../catchAsync');

const checkAuth = catchAsync(async (req, res, next) => {
  const auth = req.catalyst.userManagement();

  const user = await auth.getCurrentUser();

  if (!user) return next(new AppError('Please Login', 401));

  const profile = await req.catalyst
    .zcql()
    .executeZCQLQuery(`SELECT * FROM PROFILE WHERE user_id='${user?.user_id}'`);

  console.log(profile);
  if (!profile?.length) return next(new AppError('Please Login', 401));

  req.user = { user_id: profile?.[0]?.Profile?.ROWID };
  return next();
});

module.exports = checkAuth;
