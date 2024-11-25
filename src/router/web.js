const express = require('express')
const router = express.Router()
const homeController = require('../controller/homeController');
const loginController = require('../controller/loginController');
const detailPageController = require('../controller/detailPageController');
const profileController = require('../controller/profileController');
const { route } = require('./signUpRouter');

router.get('/', homeController.show);

router.get('/login', homeController.getLogin);
router.post('/login', loginController.loginUser);

router.get('/profile', profileController.show);

router.get('/detailPage', detailPageController.show);
  
router.get('/:id', homeController.getListItem);


module.exports = router;