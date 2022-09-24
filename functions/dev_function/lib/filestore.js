const fs = require('fs');

const uploadFileToCatalyst = async (req, folderId) => {
  const fileStore = req.catalyst.filestore().folder(folderId);

  const file = await fileStore.uploadFile({
    code: fs.createReadStream(req?.file?.path),
    name: `${req?.file?.originalname}`,
  });

  req['folderId'] = folderId;
  req['fileId'] = file?.id;
  return `${file?.folder_details} ${file?.id}`;
};

const deleteFileCatalyst = async (req, media) => {
  const [folderId, fileId] = media?.split?.(' ');
  const fileStore = req.catalyst.filestore().folder(folderId);

  return fileStore.deleteFile(fileId);
};

module.exports = {
  uploadFileToCatalyst,
  deleteFileCatalyst,
};
