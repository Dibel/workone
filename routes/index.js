var express = require('express');
var router = express.Router();

var name = 'WorkOne';
/* GET home page. */
router.get('/', function(req, res) {
    res.redirect('/home');
});

router.get('/home', function(req, res) {
  res.render('home', { title: 'WorkOne—高效的团队协作工具', id: 'home', name: name });
});

router.get('/user', function(req, res) {
   res.render('user', {title: '个人主页', id: 'user', name: name});
});

router.get('/about', function(req, res) {
    res.render('about', { title: '关于WorkOne', id: 'about', name: name });
});

module.exports = router;
