/**
 * Created by Dibel on 2014/5/25.
 */
var pg = require('pg');
var crypto = require('crypto');
var connectionString = "postgres://myuser:123456@ipv6.dibel.ml/mydb";

//var client = new pg.Client(connectionString);

exports.login = function(req, res) {
    var name = req.body.username;
    var password = req.body.password;
    if(name != "" && password != "") {
        password = crypto.createHash('md5').update(password).digest('hex');
        //client.connect();
        pg.connect(connectionString, function(err, client) {
            var query = client.query('SELECT * FROM user_password_name($1);', [name]);
            query.on('error', function(err) {
                console.log(err.message);
                return res.redirect('/login');
            });
            query.on('row', function(row, result) {
                result.addRow(row);
            });
            query.on('end', function(result) {
                console.log(result.rows.length + ' rows were received');
                if(result.rowCount > 0) {
                    if(result.rows[0].user_password_name == password) {
                        req.session.user = name;
                        return res.redirect('/user');
                    }
                }
                req.flash('error','密码不正确');
                return res.redirect('/login');
            });
        });

    } else {
        req.flash('error', '未输入用户名或密码');
        return res.redirect('/login');
    }
};

exports.register = function (req, res) {
    var name = req.body.username;
    var password = req.body.password;
    var passwordrepeat = req.body.passwordrepeat;
    if(password != passwordrepeat) {
        req.flash('error', '两次输入密码不一致');
        return res.redirect('/register');
    }
    if(name != "" && password != "") {
        password = crypto.createHash('md5').update(password).digest('hex');
        //client.connect();
        pg.connect(connectionString, function(err, client) {
            var query = client.query('SELECT * FROM user_password_name($1);', [name]);
            query.on('error', function(err) {
                console.log(err.message);
                return res.redirect('/register');
            });
            query.on('row', function(row, result) {
                result.addRow(row);
            });
            query.on('end', function(result) {
                console.log(result.rows.length + ' rows were received');
                if(result.rowCount > 0) {
                    if(result.rows[0].user_password_name == password) {
                        return res.redirect('/user');
                    }
                }
                req.flash('error','密码不正确');
                return res.redirect('/register');
            });
        });

    } else {
        req.flash('error', '未输入用户名或密码');
        return res.redirect('/register');
    }
};

//client.connect(function(err, result) {
//    if(err) {
//       console.log(err.message);
//       client.end();
//       return;
//    }
//    console.log("Connection OK\n");
//});

//module.exports = new pg.Client(connectionString);