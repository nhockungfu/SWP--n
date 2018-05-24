/**
 * Created by USER on 6/27/2017.
 */
var mustache = require('mustache'),
    q = require('q'),
    db = require('../fn/db');


exports.loadTrangBac1 = function(id, limit, offset) {

    var deferred = q.defer();

    var promises = [];

    var view = {
        idBac1: id,
        limit: limit,
        offset: offset
    };

    var sqlCount = mustache.render('select count(*) as total ' +
        'from sanpham, loaisanpham1, loaisanpham2, loaisanpham3  ' +
        'where sanpham.LOAISANPHAM3_idLOAISP3 = loaisanpham3.idLOAISP3 AND loaisanpham3.LOAISANPHAM2_idLOAISANPHAM2 = loaisanpham2.idLOAISANPHAM2 AND loaisanpham2.LOAISANPHAM1_idLOAISANPHAM1 = loaisanpham1.idLOAISANPHAM1 AND loaisanpham1.idLOAISANPHAM1 = {{idBac1}}', view);
    promises.push(db.load(sqlCount));

    var sql = mustache.render('select *, sanpham.tensanpham as tensanpham4 ' +
        'from sanpham ' +
        'left outer join '+
        '(select *, max(sotien) as tienmax ' +
        'from chitietdaugia ' +
        'GROUP BY chitietdaugia.idsanphamdaugia) d on sanpham.idSANPHAM = d.idsanphamdaugia  ' +
        'INNER JOIN loaisanpham3 on loaisanpham3.idLOAISP3 = sanpham.LOAISANPHAM3_idLOAISP3 ' +
        'INNER JOIN loaisanpham2 on loaisanpham3.LOAISANPHAM2_idLOAISANPHAM2 = loaisanpham2.idLOAISANPHAM2 ' +
        'INNER JOIN loaisanpham1 on loaisanpham2.LOAISANPHAM1_idLOAISANPHAM1 = loaisanpham1.idLOAISANPHAM1 ' +
        'INNER JOIN user on sanpham.idnguoiban = user.idUSER ' +
        'WHERE loaisanpham1.idLOAISANPHAM1  = {{idBac1}} ' +
        'GROUP BY sanpham.idSANPHAM limit {{limit}} offset {{offset}}', view);
    promises.push(db.load(sql));

    var sqlName = mustache.render('select tensanpham from loaisanpham1 where loaisanpham1.idLOAISANPHAM1 = {{idBac1}}', view);
    promises.push(db.load(sqlName));

    var sqlNameBac2 = mustache.render('select loaisanpham2.*, count(sanpham.idSANPHAM) as soLuongSanPham ' +
        'from loaisanpham2 ' +
        'LEFT OUTer JOIN loaisanpham3 on  loaisanpham2.idLOAISANPHAM2 = loaisanpham3.LOAISANPHAM2_idLOAISANPHAM2 ' +
        'LEFT OUTer JOIN sanpham on loaisanpham3.idLOAISP3 = sanpham.LOAISANPHAM3_idLOAISP3 ' +
        'INNER JOIN loaisanpham1 on loaisanpham2.LOAISANPHAM1_idLOAISANPHAM1 = loaisanpham1.idLOAISANPHAM1 ' +
        'WHERE loaisanpham1.idLOAISANPHAM1 = {{idBac1}} ' +
        'GROUP BY loaisanpham2.tensanpham', view);
    promises.push(db.load(sqlNameBac2));

    q.all(promises).spread(function(totalRow, rows, rows1, rows2) {
        for(var i = 0; i < rows.length; i++)
        {
            if(rows[i].tienmax == null)
            {
                rows[i].tienmax = rows[i].gia;
            }

            if(rows[i].conhan[0] == 0)
            {
                rows[i].thoigiankethuc = "null";
            }

        }
        var data = {
            total: totalRow[0].total,
            list: rows,
            name: rows1,
            nameBac2:rows2
        }

        deferred.resolve(data);
    });

    return deferred.promise;
}
exports.loadTrangBac2 = function(id, limit, offset) {

    var deferred = q.defer();

    var promises = [];

    var view = {
        idBac2: id,
        limit: limit,
        offset: offset
    };

    var sqlCount = mustache.render('select count(*) as total ' +
        'from sanpham, loaisanpham2, loaisanpham3  ' +
        'where sanpham.LOAISANPHAM3_idLOAISP3 = loaisanpham3.idLOAISP3 AND loaisanpham3.LOAISANPHAM2_idLOAISANPHAM2 = loaisanpham2.idLOAISANPHAM2 AND loaisanpham2.idLOAISANPHAM2 = {{idBac2}}', view);
    promises.push(db.load(sqlCount));

    var sql = mustache.render('select *, sanpham.tensanpham as tensanpham4 ' +
        'from sanpham ' +
        'left outer join ' +
        '(select *, max(sotien) as tienmax ' +
        'from chitietdaugia ' +
        'GROUP BY chitietdaugia.idsanphamdaugia) d on sanpham.idSANPHAM = d.idsanphamdaugia ' +
        'INNER JOIN loaisanpham3 on loaisanpham3.idLOAISP3 = sanpham.LOAISANPHAM3_idLOAISP3 ' +
        'INNER JOIN loaisanpham2 on loaisanpham3.LOAISANPHAM2_idLOAISANPHAM2 = loaisanpham2.idLOAISANPHAM2 ' +
        'INNER JOIN user on sanpham.idnguoiban = user.idUSER ' +
        'WHERE loaisanpham2.idLOAISANPHAM2  = {{idBac2}} ' +
        'GROUP BY sanpham.idSANPHAM LIMIT {{limit}} offset {{offset}}', view);
    promises.push(db.load(sql));

    var sqlNameBac1 = mustache.render('select loaisanpham1.*  ' +
        'from loaisanpham2, loaisanpham1 ' +
        'where loaisanpham2.LOAISANPHAM1_idLOAISANPHAM1 = loaisanpham1.idLOAISANPHAM1 AND loaisanpham2.idLOAISANPHAM2 = {{idBac2}}', view);
    promises.push(db.load(sqlNameBac1));

    var sqlNameBac2 = mustache.render('select tensanpham from loaisanpham2 where loaisanpham2.idLOAISANPHAM2 = {{idBac2}}', view);
    promises.push(db.load(sqlNameBac2));

    var sqlNameBac3 = mustache.render('select loaisanpham3.*, count(sanpham.idSANPHAM) as soLuongSanPham ' +
        'from loaisanpham3 ' +
        'LEFT OUTer JOIN sanpham on loaisanpham3.idLOAISP3 = sanpham.LOAISANPHAM3_idLOAISP3 ' +
        'INNER JOIN loaisanpham2 on loaisanpham3.LOAISANPHAM2_idLOAISANPHAM2 = loaisanpham2.idLOAISANPHAM2 ' +
        'WHERE loaisanpham2.idLOAISANPHAM2 = {{idBac2}} ' +
        'GROUP BY loaisanpham3.tensanpham', view);
    promises.push(db.load(sqlNameBac3));

    q.all(promises).spread(function(totalRow, rows, pRow1, pRow2, pRow3) {
        for(var i = 0; i < rows.length; i++)
        {
            if(rows[i].tienmax == null)
            {
                rows[i].tienmax = rows[i].gia;
            }
            if(rows[i].conhan[0] == 0)
            {
                rows[i].thoigiankethuc = "null";
            }
        }
        var data = {
            total: totalRow[0].total,
            list: rows,
            nameBac1: pRow1,
            nameBac2:pRow2,
            nameBac3:pRow3
        }
        deferred.resolve(data);
    });

    return deferred.promise;
}
exports.loadTrangBac3 = function(id, limit, offset) {

    var deferred = q.defer();

    var promises = [];

    var view = {
        idBac3: id,
        limit: limit,
        offset: offset
    };

    var sqlCount = mustache.render('select count(*) as total ' +
        'from sanpham,  loaisanpham3  ' +
        'where sanpham.LOAISANPHAM3_idLOAISP3 = loaisanpham3.idLOAISP3 AND loaisanpham3.idLOAISP3 = {{idBac3}}', view);
    promises.push(db.load(sqlCount));

    var sql = mustache.render('select *, sanpham.tensanpham as tensanpham4 ' +
        'from sanpham ' +
        'left outer join ' +
        '(select *, max(sotien) as tienmax ' +
        'from chitietdaugia ' +
        'GROUP BY chitietdaugia.idsanphamdaugia) d on sanpham.idSANPHAM = d.idsanphamdaugia ' +
        'INNER JOIN loaisanpham3 on loaisanpham3.idLOAISP3 = sanpham.LOAISANPHAM3_idLOAISP3 ' +
        'INNER JOIN user on sanpham.idnguoiban = user.idUSER ' +
        'WHERE loaisanpham3.idLOAISP3  = {{idBac3}} ' +
        'GROUP BY sanpham.idSANPHAM LIMIT {{limit}} offset {{offset}}', view);
    promises.push(db.load(sql));
    var sqlNameBac1 = mustache.render('select loaisanpham1.*  ' +
        'from loaisanpham2, loaisanpham1, loaisanpham3 ' +
        'where loaisanpham2.LOAISANPHAM1_idLOAISANPHAM1 = loaisanpham1.idLOAISANPHAM1 AND loaisanpham2.idLOAISANPHAM2 = loaisanpham3.LOAISANPHAM2_idLOAISANPHAM2 AND loaisanpham3.idLOAISP3 = {{idBac3}}', view);
    promises.push(db.load(sqlNameBac1));

    var sqlNameBac2 = mustache.render('select loaisanpham2.*  from loaisanpham2,  loaisanpham3 where  loaisanpham2.idLOAISANPHAM2 = loaisanpham3.LOAISANPHAM2_idLOAISANPHAM2 AND loaisanpham3.idLOAISP3 =  {{idBac3}}', view);
    promises.push(db.load(sqlNameBac2));

    var sqlNameBac3 = mustache.render('select loaisanpham3.* ' +
        'from loaisanpham3 ' +
        'WHERE loaisanpham3.idLOAISP3 = {{idBac3}} ', view);
    promises.push(db.load(sqlNameBac3));

    q.all(promises).spread(function(totalRow, rows, pRow1, pRow2, pRow3) {
        for(var i = 0; i < rows.length; i++)
        {
            if(rows[i].tienmax == null)
            {
                rows[i].tienmax = rows[i].gia;
            }
            if(rows[i].conhan[0] == 0)
            {
                rows[i].thoigiankethuc = "null";
            }
        }
        var data = {
            total: totalRow[0].total,
            list: rows,
            nameBac1: pRow1,
            nameBac2:pRow2,
            nameBac3:pRow3
        }
        deferred.resolve(data);
    });

    return deferred.promise;
}
exports.loadSanPham = function(id) {

    var deferred = q.defer();
    var promises = [];

    var view = {
        id: id,
    };

    var sql = mustache.render('select sanpham.*, d.*, loaisanpham1.*, loaisanpham2.*, loaisanpham3.*, sanpham.tensanpham as tenSanPham, loaisanpham1.tensanpham as tenLoai1, loaisanpham2.tensanpham as tenLoai2, loaisanpham3.tensanpham as tenLoai3, nguoiban.tendangnhap as userBan, nguoidaugia.tendangnhap as userDauGia, nguoiban.idUSER as idBan, nguoidaugia.idUSER as idDauGia, nguoidaugia.tendangnhap as userDauGiaMaHoa ' +
        'from sanpham ' +
        'LEFT OUTER JOIN (select *, max(sotien) as tienmax ' +
        'from chitietdaugia ' +
        'GROUP BY chitietdaugia.idsanphamdaugia) d on sanpham.idSANPHAM = d.idsanphamdaugia ' +
        'LEFT OUTER JOIN user as nguoidaugia ON d.idnguoidaugia = nguoidaugia.idUSER ' +
        'INNER JOIN loaisanpham3 ON sanpham.LOAISANPHAM3_idLOAISP3 = loaisanpham3.idLOAISP3 ' +
        'INNER JOIN loaisanpham2 ON loaisanpham3.LOAISANPHAM2_idLOAISANPHAM2 = loaisanpham2.idLOAISANPHAM2 ' +
        'INNER JOIN loaisanpham1 ON loaisanpham2.LOAISANPHAM1_idLOAISANPHAM1 = loaisanpham1.idLOAISANPHAM1 ' +
        'INNER JOIN user as nguoiban ON sanpham.idnguoiban = nguoiban.idUSER ' +
        'where sanpham.idSANPHAM = {{id}}', view);
    promises.push(db.load(sql));

    var sqlDauGia = mustache.render('SELECT * ' +
        'FROM sanpham ' +
        'INNER JOIN chitietdaugia on sanpham.idSANPHAM = chitietdaugia.idsanphamdaugia ' +
        'INNER JOIN user as nguoidaugia on chitietdaugia.idnguoidaugia = nguoidaugia.idUSER ' +
        'WHERE sanpham.idSANPHAM  = {{id}} ORDER BY sotien DESC', view);
    promises.push(db.load(sqlDauGia));
    q.all(promises).spread(function(rows, pRow1)
    {

        if(rows[0].tienmax == null)
        {
            rows[0].tienmax = rows[0].gia;
        }
        if(rows[0].userDauGiaMaHoa != null)
        {
            for(var j = 1; j < rows[0].userDauGiaMaHoa.length; j= j + 2)
            {
                var x = rows[0].userDauGiaMaHoa.substring(0, j) + "*" + rows[0].userDauGiaMaHoa.substring(j+1);
                rows[0].userDauGiaMaHoa = x;
            }
        }
        var data = {
            list: rows[0],
            chiTietDauGia: pRow1
        }

        deferred.resolve(data);
    });

    return deferred.promise;
}


exports.them = function(entity) {
    var d = q.defer();
    var sql = mustache.render('INSERT INTO sanphamyeuthich(USER_idUSER,idsanpham) ' +
        'SELECT * FROM (SELECT {{idUser}}, {{idSanPham}}) AS tmp ' +
        'WHERE NOT EXISTS  ' +
        '(SELECT USER_idUSER,idsanpham FROM sanphamyeuthich WHERE USER_idUSER = {{idUser}} AND sanphamyeuthich.idsanpham = {{idSanPham}})',entity);
    d.resolve(db.insert(sql));
    return d.promise;
}

exports.loadSanPhamYeuThich = function(id) {
    var d = q.defer();
    var sql = mustache.render('SELECT * FROM sanphamyeuthich WHERE sanphamyeuthich.USER_idUSER =' + id);
    d.resolve(db.load(sql));
    return d.promise;
}
exports.loadluotdaugia = function(entity) {
    var d = q.defer();
    var sql = mustache.render('SELECT * FROM sanpham where idSANPHAM="{{id}}"',entity);
    d.resolve(db.load(sql));
    return d.promise;
}
exports.themchitiet = function(entity) {
    var d = q.defer();
    var sql = mustache.render('INSERT INTO chitietdaugia (idsanphamdaugia,idnguoidaugia,sotien,thoigiandaugia) VALUES("{{id}}","{{idUser}}","{{x}}","{{thoigian}}")',entity);
    d.resolve(db.insert(sql));
    return d.promise;
}
exports.themluotdaugia = function(entity) {
    var d = q.defer();
    var sql = mustache.render('update sanpham set soluotdaugia="{{soluot}}" where idSANPHAM="{{id}}"',entity);
    d.resolve(db.update(sql));
    return d.promise;
}

