const AppError = require('../lib/AppError');
const catchAsync = require('../lib/catchAsync');
const {
  uploadFileToCatalyst,
  deleteFileCatalyst,
} = require('../lib/filestore');
const { paginateSQL } = require('../sql/paginate.sql');
const {
  getProjectsSQL,
  getProjectByIdSQL,
  getProjectSQL,
  updateProjectSQL,
  deleteProjectSQL,
  getUserProj,
  searchProjectSQL,
} = require('../sql/project.sql');

const createProject = catchAsync(async (req, res, next) => {
  const { tags, description, project_title, website, github } = req?.body || {};

  if (
    !req?.user?.user_id ||
    !tags ||
    !description ||
    !project_title ||
    !req.file
  )
    return next(new AppError('Please fill all fields', 400));

  const media = await uploadFileToCatalyst(req, process.env.PROJECT_FILE_ID);

  const project = req.catalyst.datastore().table('Project');

  const result = await project.insertRow({
    user_id: req?.user?.user_id,
    media,
    tags,
    description,
    project_title,
    website,
    github,
  });

  return res.status(200).json(result);
});

const updateProject = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const project = await zcql.executeZCQLQuery(
    getProjectSQL(req?.params?.projectId, req?.user?.user_id)
  );

  if (!project) return next(new AppError('No Project Found', 404));

  if (req?.file && project?.media) {
    await deleteFileCatalyst(req, project.media);
    req.body['media'] = await uploadFileToCatalyst(
      req,
      process.env.PROJECT_FILE_ID
    );
  }
  req.body['ROWID'] = req?.params?.projectId;

  const updatedProject = await zcql.executeZCQLQuery(
    updateProjectSQL(req?.params?.projectId, req?.body, req?.user?.user_id)
  );
  return res.status(200).json(updatedProject);
});

const getProjects = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const projects = await zcql.executeZCQLQuery(getProjectsSQL);

  return res.status(200).json(projects);
});

const getProjectById = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const project = await zcql.executeZCQLQuery(
    getProjectByIdSQL(req?.params?.projectId)
  );

  return res.status(200).json(project?.[0] || {});
});

const getUserProjects = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  console.log(getUserProj(req?.params?.userId));

  const projects = await zcql.executeZCQLQuery(
    getUserProj(req?.params?.userId)
  );

  console.log(projects, 999);
  return res.status(200).json(projects);
});

const deleteProjectById = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const project = await zcql.executeZCQLQuery(
    getProjectSQL(req?.params?.projectId, req?.user?.user_id)
  );

  console.log(project);
  if (!project || !project?.length)
    return next(new AppError('No Project Found', 404));

  if (project?.[0]?.Project?.media)
    await deleteFileCatalyst(req, project?.[0]?.Project?.media);

  await zcql.executeZCQLQuery(
    deleteProjectSQL(req?.params?.projectId, req?.user?.user_id)
  );

  return res.status(200).json('Deleted Project');
});

const searchProject = catchAsync(async (req, res, next) => {
  const zcql = req.catalyst.zcql();

  const { title, tags } = req?.query || {};
  console.log(title, 44);

  if (!(title || tags))
    return next(new AppError('Title or tags is required', 400));

  console.log(searchProjectSQL(title, tags));
  const project = await zcql.executeZCQLQuery(searchProjectSQL(title, tags));

  return res.status(200).json(project);
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  getUserProjects,
  deleteProjectById,
  searchProject,
};
