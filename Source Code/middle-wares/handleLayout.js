var q = require('q'),
    index = require('../models/indexRepo'),
    sanpham = require('../models/sanphamRepo');
var ac=require('../models/taikhoanRepo');

module.exports = function(req, res, next) {
    if(req.session.user == null)
    {
        q.all([index.loadbac1(),index.loadbac2(),index.loadbac3()
        ]).spread(function(cRows1,cRows2,cRows3) {
            res.locals.layoutModels = {
                bac1: cRows1,
                bac2:cRows2,
                bac3:cRows3,
                isLogged: req.session.isLogged,
                curUser: req.session.user,
                isQL: req.session.isQL,
                isBan:req.session.isBan,
            };
            next();
        });
    }
    else
    {
        q.all([index.loadbac1(),index.loadbac2(),index.loadbac3(), sanpham.loadSanPhamYeuThich(req.session.user.id)
        ]).spread(function(cRows1,cRows2,cRows3, pRow4) {
            req.session.sanphamyeuthich = pRow4;
            res.locals.layoutModels = {
                bac1: cRows1,
                bac2:cRows2,
                bac3:cRows3,
                isLogged: req.session.isLogged,
                curUser: req.session.user,
                isQL: req.session.isQL,
                isBan:req.session.isBan,
            };
            next();
        });
    }

}
