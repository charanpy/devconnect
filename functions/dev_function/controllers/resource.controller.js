const AppError = require('../lib/AppError');
const catchAsync = require('../lib/catchAsync');
const { uploadFileToCatalyst } = require('../lib/filestore');

const addResource = catchAsync(async (req, res, next) => {
  const { language, title, description, website, github } = req?.body || {};

  if (!language || !title || !description || !req?.file)
    return next(new AppError('Please Fill all fields', 400));

  const media = await uploadFileToCatalyst(req, process.env.RESOURCE_FILE_ID);

  const dataStore = req.catalyst.datastore().table('Resource');

  const resource = await dataStore.insertRow({
    language,
    title,
    description,
    website,
    github,
    media,
    user_id: req?.user?.user_id,
  });

  return res.status(200).json(resource);
});

const getLanguages = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const languages = await zcql.executeZCQLQuery('SELECT * FROM LANGUAGE');

  return res.status(200).json(languages);
});

const getResource = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const resources = await zcql.executeZCQLQuery(
    `SELECT * FROM RESOURCE WHERE language=${req?.params?.languageId} ORDER BY LIKES DESC`
  );

  return res.status(200).json(resources);
});

const toggleVoteResource = catchAsync(async (req, res, next) => {
  const dataStore = req.catalyst.datastore().table('Resource');

  const resource = await dataStore.getRow(req?.params?.resourceId);

  if (!resource) return next(new AppError('Resource not found', 404));

  const updateResource = await dataStore.updateRow({
    ROWID: req?.params?.resourceId,
    likes: +resource?.likes + 1,
  });

  return res.status(200).json(updateResource);
});

module.exports = {
  addResource,
  getLanguages,
  getResource,
  toggleVoteResource,
};
