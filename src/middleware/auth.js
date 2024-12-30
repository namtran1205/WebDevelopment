const authMiddleware = (req, res, next) => {
    if (req.cookies.user) {
        res.locals.user = JSON.parse(req.cookies.user);
    } else {
        res.locals.user = null;
    }
    next();
};

const authAdmin = (req, res, next) => {
    if (!res.locals.user)
    {
        res.redirect('/login');
        return;
    }
    if (res.locals.user.type !== 'admin')
    {
        res.locals.parameters = {
            title : "403 Forbidden",
            access : false,
        }
        res.status(403).render('admin/adminError');
        return;
    }
    next();
}

module.exports = {authMiddleware, authAdmin};
