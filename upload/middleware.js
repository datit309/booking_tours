const util = require("util");
const multer = require("multer");

var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploads');
    },
    filename: (req, file, callback) => {
        const match = ["image/png", "image/jpeg", "image/jpg"];

        if (match.indexOf(file.mimetype) === -1) {
            var message = `${file.originalname} is invalid. Only accept png/jpeg/jpg.`;
            return callback(message, null);
        }

        var filename = `${Date.now()}-${file.originalname}`;
        callback(null, filename);
    }
});

var singleFiles = multer({ storage: storage }).single("single-file");
let multipleFiles = multer({ storage: storage }).array("multilple-files", 10);
// Mục đích của util.promisify() là để bên controller có thể dùng async-await để gọi tới middleware này
let multipleUploadMiddleware = util.promisify(multipleFiles);
let singleUploadMiddleware = util.promisify(singleFiles);

module.exports = { multipleUploadMiddleware, singleUploadMiddleware };