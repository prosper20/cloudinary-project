const multer = require('multer');
const path = require('path');

//multer configuration
const fileStorageEngine = multer.diskStorage({
    /*destination: (req, file, cb) => {
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '--' + file.originalname);
    }*/
});

module.exports = multer({
    storage: fileStorageEngine,
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if(ext !== '.jpg' && ext !== '.JPG' && ext !== '.jpeg' && ext !== '.png') {
            cb(new Error('File format not supported'), false);
            return;
        }
        cb(null, true);    }
});
