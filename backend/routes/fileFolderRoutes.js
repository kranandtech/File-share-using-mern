const express = require('express');
const { getFileFolder } = require('../controller/fileFolderControllers');

const fileFolderRouter = express.Router();

fileFolderRouter.post("/",getFileFolder);

module.exports = fileFolderRouter;