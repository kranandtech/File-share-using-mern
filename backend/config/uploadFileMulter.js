const multer = require("multer");


const storage = new multer.memoryStorage();



// Create the multer instance
module.exports = multer({ storage: storage });