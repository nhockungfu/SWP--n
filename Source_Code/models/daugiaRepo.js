var mustache = require('mustache'),
    q = require('q'),
    db = require('../fn/db');

exports.loadngayketthuc = function() {
    var d = q.defer();
    var sql = 'select idSANPHAM from sanpham where conhan = 1 and thoigiankethuc < NOW() limit 1';
    d.resolve(db.load(sql));
    return d.promise;
}
exports.loadnguoithangcuoc = function(entity) {
    var d = q.defer();
    var sql = mustache.render('SELECT idnguoidaugia,sotien from chitietdaugia WHERE idsanphamdaugia= "{{idSanpham}}" ORDER BY thoigiandaugia DESC LIMIT 1',entity) ;
    d.resolve(db.load(sql));
    return d.promise;
}
exports.loadSanPhammail = function(entity) {
    var d = q.defer();
    var sql=mustache.render('select tensanpham,hinhanh1,hinhanh2,hinhanh3,idnguoiban,idnguoithang from sanpham where conhan = 0 and idSANPHAM= "{{idSanpham}}"',entity);
    d.resolve(db.load(sql));
    return d.promise;
}


exports.capnhatnguoithangcuoc = function(entity) {
    var d = q.defer();
    var sql=mustache.render( 'update sanpham set idnguoithang = "{{idNguoithang}}" where idSANPHAM="{{idSanpham}}"',entity);
    d.resolve(db.update(sql));
    return d.promise;
}

exports.capnhatthongbao = function(entity) {
    var d = q.defer();
    var sql=mustache.render( 'update sanpham set conhan = 0 where idSANPHAM="{{idSanpham}}"',entity);
    d.resolve(db.update(sql));
    return d.promise;
}
exports.loadthongtin = function(entity) {
    var d = q.defer();
    var sql=mustache.render('select hoten,sodienthoai,email from user where idUSER= "{{idUser}}"',entity) ;
    d.resolve(db.load(sql));
    return d.promise;
}

