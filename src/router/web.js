const express = require('express')
const router = express.Router()
const homeController = require('../controller/homeController');

router.get('/', homeController.show);

router.get('/login', homeController.getLogin);

  
router.get('/:id', homeController.getListItem);


module.exports = router;