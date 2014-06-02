var express = require('express');
var router = express.Router();
var db = require('../models/db');

/* GET home page. */
router.get('/', function(req, res) {
    res.redirect('/home');
});

router.get('/home', function(req, res) {
    if(req.session.user) {
        res.render('home', { title: 'WorkOne—高效的团队协作工具', id: 'home', user: req.session.user.truename});
    } else {
        res.render('home', { title: 'WorkOne—高效的团队协作工具', id: 'home'});
    }
});

router.get('/user', db.user);

router.get('/about', function(req, res) {
    res.render('about', { title: '关于WorkOne', id: 'about', user: req.session.user.truename });
});

router.get('/login', function(req, res) {
    if(req.session.user) {
        req.flash('error','你已经登录！请先登出');
        return res.redirect('/home');
    }
    res.render('login', { title: '登录到WorkOne', id: 'login' });
});

router.post('/login', db.login);

router.get('/register', function(req, res) {
    if(req.session.user) {
        req.flash('error','你已经登录！请先登出');
        return res.redirect('/home');
    }
    res.render('register', { title: '注册WorkOne', id: 'register' });
});

router.post('/register', db.register);

router.get('/logout', function(req, res) {
   if(req.session.user) {
       req.session.user = null;
       req.session.uid = null;
       res.redirect('/home');
   }
});

router.get('/team/:teamid', function(req, res) {
    res.send('group:'+req.params.teamid);
});

router.get('/project/:projectid', db.project);

router.get('/task/:taskid', db.task);

router.post('/task/:taskid', db.discuss);

module.exports = router;
