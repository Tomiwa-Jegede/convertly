const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "server/uploads/");
  },

  filename(req, file, cb) {
    cb(
      null,
      Date.now() +
        "-" +
        Math.random().toString(36).substring(2) +
        path.extname(file.originalname),
    );
  },
});

module.exports = multer({ storage });
