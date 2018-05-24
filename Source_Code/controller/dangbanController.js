/**
 * Created by Qui on 6/27/2017.
 */
var express = require('express'),
    dangban = require('../models/dangbanRepo'),
    sanpham3 = require('../models/indexRepo'),
    q = require('q');

var r = express.Router();



r.get('/', function(req, res) {
    q.all([sanpham3.loadbac3()])
        .spread(function(pRow1)
        {
            var vm = {
                layoutModels: res.locals.layoutModels,
            }
            res.render('Tài khoản/dangbannew', vm);
        })
});








/*

 r.get('/', function(req, res) {
 console.log(req.body.link1);
 var vm = {
 layout: false,
 };
 res.render('Tài khoản/dangbannew', vm);
 });
 */



r.post('/', function(req, res) {

    //console.log(req.body.tensnapham);





    //console.log(req.body.link1);
    //console.log(req.body.tensanpham);
    //console.log(req.body.motachitietsanpham);


    var entity = {
        link1: req.body.link1,
        link2: req.body.link2,
        link3: req.body.link3,
        chonloaisanpham: req.body.chonloaisanpham,
        tensanpham: req.body.tensanpham,
        giakhoidiem: req.body.giakhoidiem,
        giamuangay: req.body.giamuangay,
        motachitiet: req.body.motachitietsanpham,
        buocgia: req.body.buocgia,
        idnguoiban: req.session.user.id,
        tudonggiahan: req.body.tudonggiahan,
        thoigiandang: req.body.thoigiandang,
        thoigianketthuc: req.body.thoigianketthuc,
        motangangon: req.body.motangangon


    };

    //console.log(entity.tudonggiahan);


    dangban.dangsanpham123(entity)
        .then(function(rows) {
            var vm = {
                layoutNGuoidung: false,
                timkiem123: rows,
            };
            //console.log(vm)
            res.render('Tài khoản/dangbannew', vm);
        }).fail(function(err) {
        console.log(err);
        res.end('fail');
    });

});







/*app.get('/test.js', function(req, res) {
 res.set('Content-Type', 'application/javascript');
 res.render('testPage', { myVar : 'TEST'});
 });*/







/*
 r.post('/add', function(req, res) {

 console.log(req.body.input700);


 categoryRepo.insert(req.body).then(function(data) {
 var vm = {
 layout: false,
 };
 res.render('Tài khoản/dangbannew', vm);
 })
 });*/





module.exports = r;