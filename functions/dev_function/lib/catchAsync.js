const { deleteFileCatalyst } = require('./filestore');
const { deleteFiles } = require('./middlewares/multer.middleware');

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next)
      .catch(async (e) => {
        if (req?.file && req?.folderId && req?.fileId) {
          await deleteFileCatalyst(req, `${req?.folderId} ${req?.fileId}`);
        }
        next(e);
      })
      .finally(async () => {
        await deleteFiles();
      });
  };
};
