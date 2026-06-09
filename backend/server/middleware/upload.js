const multer = require("multer");

// MEMORY STORAGE (NO DISK)
const storage = multer.memoryStorage();

module.exports = multer({ storage });
