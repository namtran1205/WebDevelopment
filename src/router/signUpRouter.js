const express = require('express')
const router = express.Router()
const signUpController = require('../controller/signUpController')

router.get('/', (req, res) => signUpController.show(req, res));

router.post('/', (req, res) => signUpController.createUser(req, res));

module.exports = router;