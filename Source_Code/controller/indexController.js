/**
 * Created by MiM on 21/06/2017.
 */
var express = require('express'),
    index = require('../models/indexRepo'),
    q = require('q');
var r = express.Router();


r.get('/', function(req, res) {
    q.all([index.loadbac2(), index.loadTop5SanPhamDauGia(), index.loadTop5GiaCaoNhat(), index.loadTop5SanPhamGanKetThuc(), index.loadLoaiSanPhamQuangCao(), index.loadSanPhamQuangCao()])
        .spread(function(pRow1, pRow2, pRow3, pRow4, pRow5, pRow6)
    {
        var vm = {
            layoutModels: res.locals.layoutModels,
            bac2:pRow1,
            top5sanphamdaugia: pRow2,
            top5sanphamgiacao: pRow3,
            top5sanphamganketthuc:pRow4,
            loaiSanPhamQuangCao:pRow5,
            sanPhamQuangCao:pRow6
        }

        res.render('index', vm);
    })
});

module.exports = r;
