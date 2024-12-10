const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        res.render('forgetPassword');
    } catch (error) {
        console.log("Error rendering forget password page:", error.message);
        res.status(500).send("Error rendering forget password page");
    }
});

module.exports = router;