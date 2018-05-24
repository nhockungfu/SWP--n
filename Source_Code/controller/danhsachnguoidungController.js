/**
 * Created by MiM on 22/06/2017.
 */
var express = require('express'),
    danhsachnguoidung = require('../models/danhsachnguoidungRepo'),
    q = require('q');
var r = express.Router();
r.get('/', function(req, res) {
    if(req.session.isLogged===true)
    {
        if(req.session.isQL===true) {
            danhsachnguoidung.load()
                .then(function (rows) {
                    var vm = {
                        layoutNGuoidung: false,
                        nguoidung: rows,
                    };
                    res.render('Quản trị/quanlynguoidung', vm);
                }).fail(function (err) {
                console.log(err);
                res.end('fail');
            });
        }
        else {
            res.redirect('/');
        }
    }
    else{
        res.redirect('/taikhoan/dangnhap');
    }

});
module.exports = r;