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
    if(req.session.user) {
        res.render('about', { title: '关于WorkOne', id: 'about', user: req.session.user.truename });
    } else {
        res.render('about', { title: '关于WorkOne', id: 'about'});
    }
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

router.get('/team/:teamid', db.team);


router.get('/project/:projectid', db.project);

router.post('/project/:projectid', db.newtask);

router.get('/task/:taskid', db.task);

router.post('/task/:taskid', db.discuss);

router.post('/post_newproject', db.newproject);

router.post('/delete_task', db.deletetask);

router.post('/delete_project', db.deleteproject);

module.exports = router;
