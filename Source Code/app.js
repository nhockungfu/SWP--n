var express = require('express'),
    handlebars = require('express-handlebars'),
    handlebars_sections = require('express-handlebars-sections'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    path = require('path'),
    wnumb = require('wnumb');


var request = require('request');
var session = require('express-session');
// var fileStore = require('session-file-store')(session);
var MySQLStore = require('express-mysql-session')(session);

var app = express();

app.use(morgan('dev'));
app.use(session({
    secret: 'Z7X7gXzoKBT8h18jwXBEP4T0kJ8=',
    resave: false,
    saveUninitialized: true,
    // store: new fileStore()
    store: new MySQLStore({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'quanlydaugia',
        createDatabaseTable: true,
        schema: {
            tableName: 'sessions',
            columnNames: {
                session_id: 'session_id',
                expires: 'expires',
                data: 'data'
            }
        }
    }),
}));
app.engine('hbs', handlebars({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: 'views/_layouts/',
     helpers: {
         section: handlebars_sections(),
         number_format: function (n) {
             var nf = wnumb({
                 thousand: ','
             });
             return nf.to(n) + " VNĐ";
         },
         number_format1: function (n) {
             var nf = wnumb({
                 thousand: ','
             });
             return nf.to(n) + " Đ";
         }
     }
}));
app.set('view engine', 'hbs');

app.use(express.static(
    path.resolve(__dirname, 'public')
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// app.use(handle404);

app.listen(3000,function () {
    console.log('Server Listenning...');
});
