
var express = require('express'),
    danhmuc = require('../models/quanlydanhmucRepo'),
    q = require('q');
var r = express.Router();
r.get('/', function(req, res) {
    if(req.session.isLogged===true)
    {
        if(req.session.isQL===true) {
            q.all([danhmuc.loadbac1(), danhmuc.loadbac2(), danhmuc.loadbac3()])
                .spread(function (pRow1, pRow2, pRow3) {
                    var vm = {
                        layoutdanhmuc: true,
                        bac1: pRow1,
                        bac2: pRow2,
                        bac3: pRow3,
                    }
                    res.render('Quản trị/quanlydanhsachdanhmuc', vm);
                })
        }
        else {
            res.redirect('/');
        }
    }
});
r.get('/sua', function(req, res) {
    var entity={
        id:req.query.id
    }
    danhmuc.loadbac3theoid(entity).then(function (rows) {
        var vm={
            danhmuc3:rows
        }
        console.log(vm);
        res.render('Quản trị/suadanhmuc',vm);
    })
});
r.post('/xoa', function(req, res) {
    var entity={
        id:req.body.id,
    }
    console.log(entity)
    q.all([danhmuc.loadsanpham(entity)])
        .spread(function(pRow1)
        {
            var vm = {
                NoProDuct:pRow1.length===0,
            }
            console.log(vm);
            if(vm.NoProDuct===false)
            {
                q.all([danhmuc.loadbac1(), danhmuc.loadbac2(), danhmuc.loadbac3()])
                    .spread(function (pRow1, pRow2, pRow3) {
                        var vm = {
                            layoutModels: res.locals.layoutModels,
                            bac1: pRow1,
                            showError: true,
                            errorMsg: 'Có sản phẩm không được xóa danh mục'
                        }
                        res.render('Quản trị/quanlydanhsachdanhmuc', vm);
                    })
            }
            else {
                danhmuc.xoa(entity).then(function (aff) {
                    res.redirect('/quanlidanhmuc');
                })
            }
        })

});
module.exports = r;
