/**
 * Created by Qui on 6/24/2017.
 */
var mustache = require('mustache'),
    q = require('q'),
    db = require('../fn/db');


exports.loadTrangTimKiem = function(timKiem, limit, offset) {

    var deferred = q.defer();

    var promises = [];

    var view = {
        timKiem: timKiem,
        limit: limit,
        offset: offset
    };

    var sqlCount = mustache.render('select count(*) as total ' +
        'from user, sanpham, loaisanpham3, loaisanpham1, loaisanpham2 ' +
        'where (sanpham.idnguoiban = user.idUSER AND sanpham.LOAISANPHAM3_idLOAISP3 = loaisanpham3.idLOAISP3 AND loaisanpham3.LOAISANPHAM2_idLOAISANPHAM2 = loaisanpham2.idLOAISANPHAM2 AND loaisanpham2.LOAISANPHAM1_idLOAISANPHAM1 = loaisanpham1.idLOAISANPHAM1) ' +
        'AND (loaisanpham2.tensanpham like "%{{timKiem}}%" OR sanpham.tensanpham like "%{{timKiem}}%" OR loaisanpham1.tensanpham like "%{{timKiem}}%" OR loaisanpham2.tensanpham like "%{{timKiem}}%")', view);
   promises.push(db.load(sqlCount));

    var sql = mustache.render('select *, sanpham.tensanpham as tensanpham4, sanpham.tensanpham as tensanpham4, nguoiban.hoten as hoTenNguoiBan, nguoidaugia.hoten as hoTenNguoiDauGia ' +
        'from sanpham ' +
        'left outer join ' +
        '(select *, max(sotien) as tienmax ' +
        'from chitietdaugia ' +
        'GROUP BY chitietdaugia.idsanphamdaugia) d on sanpham.idSANPHAM = d.idsanphamdaugia	' +
        'INNER JOIN loaisanpham3 on loaisanpham3.idLOAISP3 = sanpham.LOAISANPHAM3_idLOAISP3 ' +
        'INNER JOIN loaisanpham2 on loaisanpham3.LOAISANPHAM2_idLOAISANPHAM2 = loaisanpham2.idLOAISANPHAM2 ' +
        'INNER JOIN loaisanpham1 on loaisanpham2.LOAISANPHAM1_idLOAISANPHAM1 = loaisanpham1.idLOAISANPHAM1 ' +
        'INNER JOIN user as nguoiban on sanpham.idnguoiban = nguoiban.idUSER ' +
        'left outer join user as nguoidaugia on d.idnguoidaugia = nguoidaugia.idUSER ' +
        'WHERE  (loaisanpham2.tensanpham like "%{{timKiem}}%" OR sanpham.tensanpham like "%{{timKiem}}%" OR loaisanpham1.tensanpham like "%{{timKiem}}%" OR loaisanpham2.tensanpham like "%{{timKiem}}%") '+
        'limit {{limit}} offset {{offset}}', view);


    promises.push(db.load(sql));
    q.all(promises).spread(function(totalRow, rows) {
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
            if(rows[i].hoTenNguoiDauGia != null)
            {
                for(var j = 1; j < rows[i].hoTenNguoiDauGia.length; j= j + 2)
                {
                    var x = rows[i].hoTenNguoiDauGia.substring(0, j) + "*" + rows[i].hoTenNguoiDauGia.substring(j+1);
                    rows[i].hoTenNguoiDauGia = x;
                }
            }


        }
        var data = {
            total: totalRow[0].total,
            list: rows

            // nameBac1: pRow1,
            // nameBac2:pRow2,
            // nameBac3:pRow3
        }
        deferred.resolve(data);
    });

    return deferred.promise;
}
exports.loadTrangTimKiemSapXep = function(timKiem, loai, limit, offset) {

    var deferred = q.defer();

    var promises = [];

    var view = {
        timKiem: timKiem,
        loai: loai,
        limit: limit,
        offset: offset
    };

    var sqlCount = mustache.render('select count(*) as total ' +
        'from user, sanpham, loaisanpham3, loaisanpham1, loaisanpham2 ' +
        'where (sanpham.idnguoiban = user.idUSER AND sanpham.LOAISANPHAM3_idLOAISP3 = loaisanpham3.idLOAISP3 AND loaisanpham3.LOAISANPHAM2_idLOAISANPHAM2 = loaisanpham2.idLOAISANPHAM2 AND loaisanpham2.LOAISANPHAM1_idLOAISANPHAM1 = loaisanpham1.idLOAISANPHAM1) ' +
        'AND (loaisanpham2.tensanpham like "%{{timKiem}}%" OR sanpham.tensanpham like "%{{timKiem}}%" OR loaisanpham1.tensanpham like "%{{timKiem}}%" OR loaisanpham2.tensanpham like "%{{timKiem}}%")', view);
    promises.push(db.load(sqlCount));

    if(loai == "sortbymoneyasc")
    {
        var sql = mustache.render('select *, sanpham.tensanpham as tensanpham4, sanpham.tensanpham as tensanpham4, nguoiban.hoten as hoTenNguoiBan, nguoidaugia.hoten as hoTenNguoiDauGia,GREATEST(IFNULL(tienmax, 0),sanpham.gia) as tiencaonhat ' +
            'from sanpham ' +
            'left outer join ' +
            '(select *, max(sotien) as tienmax ' +
            'from chitietdaugia ' +
            'GROUP BY chitietdaugia.idsanphamdaugia) d on sanpham.idSANPHAM = d.idsanphamdaugia	' +
            'INNER JOIN loaisanpham3 on loaisanpham3.idLOAISP3 = sanpham.LOAISANPHAM3_idLOAISP3 ' +
            'INNER JOIN loaisanpham2 on loaisanpham3.LOAISANPHAM2_idLOAISANPHAM2 = loaisanpham2.idLOAISANPHAM2 ' +
            'INNER JOIN loaisanpham1 on loaisanpham2.LOAISANPHAM1_idLOAISANPHAM1 = loaisanpham1.idLOAISANPHAM1 ' +
            'INNER JOIN user as nguoiban on sanpham.idnguoiban = nguoiban.idUSER ' +
            'left outer join user as nguoidaugia on d.idnguoidaugia = nguoidaugia.idUSER ' +
            'WHERE  (loaisanpham2.tensanpham like "%{{timKiem}}%" OR sanpham.tensanpham like "%{{timKiem}}%" OR loaisanpham1.tensanpham like "%{{timKiem}}%" OR loaisanpham2.tensanpham like "%{{timKiem}}%") '+
            'GROUP BY sanpham.idSANPHAM ORDER BY tiencaonhat ASC limit {{limit}} offset {{offset}}', view);
    }
    else {
        var sql = mustache.render('select *, sanpham.tensanpham as tensanpham4, sanpham.tensanpham as tensanpham4, nguoiban.hoten as hoTenNguoiBan, nguoidaugia.hoten as hoTenNguoiDauGia ' +
            'from sanpham ' +
            'left outer join ' +
            '(select *, max(sotien) as tienmax ' +
            'from chitietdaugia ' +
            'GROUP BY chitietdaugia.idsanphamdaugia) d on sanpham.idSANPHAM = d.idsanphamdaugia	' +
            'INNER JOIN loaisanpham3 on loaisanpham3.idLOAISP3 = sanpham.LOAISANPHAM3_idLOAISP3 ' +
            'INNER JOIN loaisanpham2 on loaisanpham3.LOAISANPHAM2_idLOAISANPHAM2 = loaisanpham2.idLOAISANPHAM2 ' +
            'INNER JOIN loaisanpham1 on loaisanpham2.LOAISANPHAM1_idLOAISANPHAM1 = loaisanpham1.idLOAISANPHAM1 ' +
            'INNER JOIN user as nguoiban on sanpham.idnguoiban = nguoiban.idUSER ' +
            'left outer join user as nguoidaugia on d.idnguoidaugia = nguoidaugia.idUSER ' +
            'WHERE  (loaisanpham2.tensanpham like "%{{timKiem}}%" OR sanpham.tensanpham like "%{{timKiem}}%" OR loaisanpham1.tensanpham like "%{{timKiem}}%" OR loaisanpham2.tensanpham like "%{{timKiem}}%") '+
            'GROUP BY sanpham.idSANPHAM ORDER BY thoigiankethuc DESC limit {{limit}} offset {{offset}}', view);
    }


    promises.push(db.load(sql));
    q.all(promises).spread(function(totalRow, rows) {
        for(var i = 0; i < rows.length; i++)
        {
            if(loai == "sortbytimedesc")
            {
                if(rows[i].tienmax == null)
                {
                    rows[i].tienmax = rows[i].gia;
                }
                else {
                    if(rows[i].tienmax < rows[i].gia)
                    {
                        rows[i].tienmax = rows[i].gia;
                    }
                }
            }
            if(rows[i].conhan[0] == 0)
            {
                rows[i].thoigiankethuc = "null";
            }
            if(rows[i].hoTenNguoiDauGia != null)
            {
                for(var j = 1; j < rows[i].hoTenNguoiDauGia.length; j= j + 2)
                {
                    var x = rows[i].hoTenNguoiDauGia.substring(0, j) + "*" + rows[i].hoTenNguoiDauGia.substring(j+1);
                    rows[i].hoTenNguoiDauGia = x;
                }
            }


        }
        var data = {
            total: totalRow[0].total,
            list: rows,
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

