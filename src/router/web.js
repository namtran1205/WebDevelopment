const express = require('express')
const router = express.Router()
const homeController = require('../controller/homeController');
const loginController = require('../controller/loginController');
const detailPageController = require('../controller/detailPageController');
const profileController = require('../controller/profileController');
const getPosts = require('../controller/postController');


router.get('/', homeController.show);

router.get('/login', homeController.getLogin);

router.post('/login', loginController.loginUser);

router.get('/profile', profileController.show);

router.get('/detailPage/:idPost', detailPageController.show);

router.post('/detailPage/:idPost', detailPageController.postComment);

router.get('/download/:id', detailPageController.download);


//router.get('/editor/', editorController.show);

// router.get('/detailPage', detailPageController.show);
router.get('/favicon.ico', (req, res) => res.status(204).end());
  
router.get(['/category/:id', '/tag/:id', '/subCategory/:id'],getPosts.getListPosts);


module.exports = router;