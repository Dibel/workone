var express = require('express');
var router = express.Router();
var db = require('../models/db');

/* GET home page. */
router.get('/', function(req, res) {
    res.redirect('/home');
});

router.get('/home', function(req, res) {
  res.render('home', { title: 'WorkOne—高效的团队协作工具', id: 'home' });
});

router.get('/user', db.user);

router.get('/about', function(req, res) {
    res.render('about', { title: '关于WorkOne', id: 'about' });
});

router.get('/login', function(req, res) {
    res.render('login', { title: '登录到WorkOne', id: 'login' });
});

router.post('/login', db.login);

router.get('/register', function(req, res) {
    res.render('register', { title: '注册WorkOne', id: 'register' });
});

router.post('/register', db.register);

router.get('/logout', function(req, res) {
   if(req.session.user && req.session.user.length) {
       req.session.user = null;
       req.session.uid = null;
       res.redirect('/home');
   }
});

router.get('/team/:teamid', function(req, res) {
    res.send('group:'+req.params.teamid);
});

router.get('/project/:projectid', function(req, res) {
    res.send('project:'+req.params.projectid);
})

router.get('/task/:taskid', db.task);

module.exports = router;
