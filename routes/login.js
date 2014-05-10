/**
 * Created by Dibel on 2014/5/8.
 */
var express = require('express');
var router = express.Router();

var name = 'WorkOne';
/* GET home page. */
router.get('/', function(req, res) {
    res.render('login', { title: '登录到WorkOne', id: 'login', name: name });
});

module.exports = router;