var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var session = require("express-session");
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/images/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('secret'));
app.use(session({cookie: { maxAge: 1800000 }}));
app.use(flash());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    res.locals.user=req.session.user;

    var err = req.flash('error');
    var success = req.flash('success');

    res.locals.error = err.length ? err : null;
    res.locals.success = success.length ? success : null;

    next();
});

app.all('/user', function(req, res, next) {
    if(req.session.user && req.session.user.name.length) {
        next();
    } else {
        req.flash('error', '您尚未登录，请先登录~');
        res.redirect('/login');
    }
});

app.all('/team/:teamid', function(req, res, next) {
    if(req.session.user && req.session.user.name.length) {
        next();
    } else {
        req.flash('error', '您尚未登录，请先登录~');
        res.redirect('/login');
    }
});

app.all('/project/:projectid', function(req, res, next) {
    if(req.session.user && req.session.user.name.length) {
        next();
    } else {
        req.flash('error', '您尚未登录，请先登录~');
        res.redirect('/login');
    }
});

app.all('/task/:taskid', function(req, res, next) {
    if(req.session.user && req.session.user.name.length) {
        next();
    } else {
        req.flash('error', '您尚未登录，请先登录~');
        res.redirect('/login');
    }
});

app.use('/', routes);
//app.use('/home', routes);
//app.use('/about', routes);
//app.use('/login', login);
//app.use('/register', register);
//app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
