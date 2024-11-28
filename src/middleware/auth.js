const authMiddleware = (req, res, next) => {
    if (req.cookies.user) {
        res.locals.user = JSON.parse(req.cookies.user);
    } else {
        res.locals.user = null;
    }
    next();
};

module.exports = authMiddleware;