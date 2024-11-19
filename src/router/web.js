const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('homepage');
  });
  
router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.render('listItem');
});

router.get('/login', (req, res) => {
    res.render('login');
});

module.exports = router;