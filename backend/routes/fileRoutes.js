const express = require('express');
const router = express.Router();
const { createFile } = require('../controller/fileControllers');


router.post('/', createFile);

module.exports = router;
