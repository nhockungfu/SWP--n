/**
 * Created by USER on 6/30/2017.
 */
var express = require('express'),
    quanlisanpham = require('../models/quanlisanphamcanhanRepo'),
    q = require('q');
var r = express.Router();

r.get('/sanphamyeuthich', function(req, res) {



    var rec_per_page = 7;
    var curPage = req.query.page ? req.query.page : 1;
    var offset = (curPage - 1) * rec_per_page;

    quanlisanpham.loadTrangSanPhamYeuThich(req.session.user.id, rec_per_page, offset)
        .then(function(data) {
            var number_of_pages = data.total / rec_per_page;
            if (data.total % rec_per_page > 0) {
                number_of_pages++;
            }

            var pages = [];
            for (var i = 1; i <= number_of_pages; i++) {
                pages.push({
                    pageValue: i,
                    isActive: i === +curPage
                });
            }

            res.render('Tài khoản/sanphamyeuthichnew', {
                layoutModels: res.locals.layoutModels,
                productsYeuThich: data.list,
                isEmpty: data.total === 0,
                total: data.total,
                sanphamyeuthich: req.session.sanphamyeuthich,

                pages: pages,
                curPage: curPage,
                prevPage: curPage - 1,
                nextPage: curPage + 1,
                showPrevPage: curPage > 1,
                showNextPage: curPage < number_of_pages - 1,

            });
            console.log(data.list);
        });
});
module.exports = r;