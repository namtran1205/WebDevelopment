const express = require('express');
const createPageController = require('../controller/createPageController'); // Import controller

const router = express.Router();

router.post('/api/posts', createPageController.post);
module.exports = router;
