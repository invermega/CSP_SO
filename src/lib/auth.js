

module.exports = {  
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/iniciarsesion');
    },

    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
         return next();
        }
        res.redirect('/');
    }
};