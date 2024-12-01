const express = require('express');
const createPage = require('../controller/createPageController'); // Import controller

const router = express.Router();

router.post('/api/posts', createPage.post);
module.exports = router;
