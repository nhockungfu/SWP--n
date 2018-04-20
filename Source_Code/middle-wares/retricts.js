/**
 * Created by MiM on 24/06/2017.
 */
module.exports = function(req, res, next) {
    if (req.session.isLogged === true) {
        next();
    } else {
        var url = '/taikhoan/thoat?retUrl=' + req.originalUrl;
        res.redirect(url);
    }
};
