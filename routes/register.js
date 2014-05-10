/**
 * Created by Dibel on 2014/5/8.
 */
var express = require('express');
var router = express.Router();

var name = 'WorkOne';
/* GET home page. */
router.get('/', function(req, res) {
    res.render('register', { title: '注册WorkOne', id: 'register', name: name });
});

module.exports = router;