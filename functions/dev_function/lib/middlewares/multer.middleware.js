const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');

function checkFileType(file, cb, fileType) {
  const filetypes = fileType === 'image' ? /jpeg|jpg|png|webp/ : /pdf|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    // custom error
    cb(new multer.MulterError('IMAGES_ONLY'));
  }
}
console.log(process.cwd(), 66);
const upload = (fileType = 'image') =>
  multer({
    dest: path.join(process.cwd(), 'uploads'),
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb, fileType);
    },
  });

const getFileExtension = (file) => file?.originalname?.split('.')?.pop();

const deleteFiles = async () => {
  try {
    const files = await fs.readdir(path.join(process.cwd(), `/uploads`));
    console.log(files);
    const unlinkPromises = files?.map((filename) =>
      fs.unlink(path.join(process.cwd(), `/uploads/${filename}`))
    );
    return Promise.all(unlinkPromises);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  upload,
  getFileExtension,
  deleteFiles,
};
