const AppError = require('../lib/AppError');
const catchAsync = require('../lib/catchAsync');

const register = catchAsync(async (req, res, next) => {
  const { email, username } = req.body;

  if (!email || !username)
    return next(new AppError('Invalid Credentials', 400));

  const auth = req.catalyst.userManagement();
  const profile = req.catalyst.datastore().table('profile');

  const user = await auth.registerUser(
    {
      platform_type: 'web',
      zaid: 10047661455,
      redirect_url: 'http://localhost:3000/app/',
    },
    { last_name: username, email_id: email, first_name: username }
  );

  await profile.insertRow({
    email,
    username,
    user_id: user?.user_details?.user_id,
  });

  return res.status(200).json(user);
});

const getMe = catchAsync(async (req, res, next) => {
  return res.status(200).json(req?.user);
});

module.exports = {
  register,
  getMe,
};
