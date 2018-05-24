var daugia= require('../models/daugiaRepo');
var nodemailer=require('nodemailer');
var q = require('q');
var hbs=require('nodemailer-express-handlebars');
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: '4p1qdaugia',
        pass: 'Phuc11296'
    }
});

transporter.use('compile',hbs({
    viewPath:'views',
    extName:'.hbs'
}))
exports.KiemTraSanPham= async function DuyetSanPham(){
    await q.all([daugia.loadngayketthuc()]).spread(async function (rows) {
        if(rows.length === 0){
            DuyetSanPham();
        }
        else
        {
            var sanpham = {
                mangsanpham : rows
            }
            var entity={
                idSanpham : sanpham.mangsanpham[0].idSANPHAM,
            }
            console.log('Sản phẩm có Id = ' +entity.idSanpham + ' hết hạn');
            await q.all([daugia.capnhatthongbao(entity),daugia.loadnguoithangcuoc(entity)]).spread(async function (capnhat,nguoithang) {
                if(nguoithang.length !== 0)
                {
                    var nguoi={
                        idNguoithang: nguoithang[0].idnguoidaugia ,
                        idSanpham : entity.idSanpham
                    }
                    await q.all([daugia.capnhatnguoithangcuoc(nguoi)]).spread( async function (thongbao) {
                        await  q.all([daugia.loadSanPhammail(entity)]).spread(async function (sanpham) {
                            var nguoidaugiathang={
                                idUser : sanpham[0].idnguoithang,
                            }
                            var nguoiban={
                                idUser : sanpham[0].idnguoiban,
                            }
                            await   q.all([daugia.loadthongtin(nguoidaugiathang),daugia.loadthongtin(nguoiban)]).spread(async function (re,res) {
                                console.log("Tiến hành gửi mail");
                               await sendMailBan(res,re,sanpham,nguoithang);
                               await sendMailThang(res,re,sanpham,nguoithang);
                               await DuyetSanPham();
                            })

                        })
                    })

                }else{
                    //await setTimeout(DuyetSanPham,1) ;
                    await DuyetSanPham();
                }
            })
        }
    }).then().catch(err => console.log(err))
}
//console.log("Sever Test is running");
//setInterval(DuyetSanPham,10000);
//DuyetSanPham();
async function sendMailBan(nguoiban,nguoithang,sanpham,sotien) {
    await transporter.sendMail({
        from:'Hệ thống dấu giá 4P1Q',
        to: nguoiban[0].email,
        subject:'Sản phẩm của bạn dã có người dấu giá thành công ',
        template:'Đấu giá/mailBan',
        context:{
            tennguoimua:nguoithang[0].hoten,
            sodienthoai : nguoithang[0].sodienthoai,
            tensanpham : sanpham[0].tensanpham,
            sotien : sotien[0].sotien
        }
    },async function (err) {
        if(err){console.log(err)}
        else
        {console.log('Gửi mail cho ' +nguoiban[0].email + ' thành công' )}
    })
}
async function sendMailThang(nguoiban,nguoithang,sanpham,sotien) {
    await  transporter.sendMail({
        from:'Hệ thống dấu giá 4P1Q',
        to: nguoithang[0].email,
        subject:'Bạn dã dấu giá thành công sản phẩm trên hệ thống chúng tôi',
        template:'Đấu giá/mailThang',
        context:{
            tennguoiban:nguoiban[0].hoten,
            sodienthoai : nguoiban[0].sodienthoai,
            tensanpham : sanpham[0].tensanpham,
            hinhanh1 : sanpham[0].hinhanh1,
            hinhanh2 :sanpham[0].hinhanh2 ,
            hinhanh3 : sanpham[0].hinhanh3,
            sotien : sotien[0].sotien
        }
    },async function (err) {
        if(err){console.log(err)}
        else
        {
            console.log('Gửi mail cho ' +nguoithang[0].email + ' thành công');
            //await DuyetSanPham();
            //await setTimeout(DuyetSanPham,1) ;
        }
    })
}
