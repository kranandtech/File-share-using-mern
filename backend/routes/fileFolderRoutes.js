const express = require('express');
const { getFileFolder, deleteFile } = require('../controller/fileFolderControllers');

const fileFolderRouter = express.Router();

fileFolderRouter.post("/",getFileFolder);
fileFolderRouter.route("/:id").delete(deleteFile);


module.exports = fileFolderRouter;