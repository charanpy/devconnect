const AppError = require('../AppError');
const catchAsync = require('../catchAsync');

const checkAuth = catchAsync(async (req, res, next) => {
  const auth = req.catalyst.userManagement();

  const user = await auth.getCurrentUser();

  if (!user) return next(new AppError('Please Login', 401));

  req.user = user;
  return next();
});

module.exports = checkAuth;
