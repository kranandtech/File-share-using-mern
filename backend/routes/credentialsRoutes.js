const express = require('express');
const router = express.Router();
const { getCloudinaryCredentials } = require('../controller/credentialsController');

router.get('/', getCloudinaryCredentials);

module.exports = router;
