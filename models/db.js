/**
 * Created by Dibel on 2014/5/25.
 */
var pg = require('pg');
var crypto = require('crypto');
var moment = require('moment');
moment.lang('zh-cn');
//var connectionString = "postgres://myuser:123456@ipv6.dibel.ml/mydb";
var connectionString = "postgres://myuser:123456@localhost/mydb";
var Discuss = require('./discuss.js');
var Team = require('./team.js');
var Project = require('./project.js');
var Task = require('./task.js');
var User = require('./user.js');

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
                if(result.rowCount > 0) {
                    if(result.rows[0].user_password_name == password) {
                        var query1 = client.query('SELECT "ID","NAME" FROM "User" WHERE "LOGINNAME"=$1', [name]);
                        query1.on('error', function(err) {
                            console.log(err.message);
                            return res.redirect('/login');
                        });
                        query1.on('row', function(row, result) {
                            result.addRow(row);
                        });
                        query1.on('end', function(result) {
                            if(result.rowCount > 0) {
                                var uid = result.rows[0].ID.toString();
                                var truename = result.rows[0].NAME;
                                req.session.user = new User({
                                    name: name,
                                    uid: uid,
                                    truename: truename
                                });
                                return res.redirect('/user');
                            }
                        });
                    } else {
                        req.flash('error', '密码不正确');
                        return res.redirect('/login');
                    }
                } else {
                    req.flash('error', '用户不存在');
                    return res.redirect('/login');
                }
            });
        });

    } else {
        req.flash('error', '未输入用户名或密码');
        return res.redirect('/login');
    }
};

exports.register = function(req, res) {
    var name = req.body.username;
    var truename = req.body.name;
    var password = req.body.password;
    var passwordrepeat = req.body.passwordrepeat;
    if(password != passwordrepeat) {
        req.flash('error', '两次输入密码不一致');
        return res.redirect('/register');
    }
    if(truename == "") {
        req.flash('error', '未输入昵称');
        return res.redirect('/register');
    }
    if(name != "" && password != "") {
        password = crypto.createHash('md5').update(password).digest('hex');
        //client.connect();
        pg.connect(connectionString, function(err, client) {
            //TODO:SQL Query
            //var query = client.query('SELECT * FROM newteam($1,$2,$3)', [1,'test','test']);
            var query = client.query('INSERT INTO "User" ("NAME","PASSWORD","LOGINNAME") VALUES($1,$2,$3) returning "ID";', [truename, password, name]);
            query.on('error', function(err) {
                console.log(err.message);
                req.flash('error', '该用户已存在！');
                return res.redirect('/register');
            });
            query.on('row', function(row, result) {
                result.addRow(row);
            });
            query.on('end', function(result) {
                console.log(result.rows.length + ' rows were received');
                if(result.rowCount > 0) {
                    console.log(result);
                    //req.flash('success', '注册成功！');
                    req.session.user = new User({
                            name: name,
                            uid: result.rows[0].ID,
                            truename: truename
                    });
                    return res.redirect('/user');
                } else {
                    req.flash('error', '该用户已存在！');
                    return res.redirect('/register');
                }
            });
        });

    } else {
        req.flash('error', '未输入用户名或密码');
        return res.redirect('/register');
    }
};

exports.user = function (req, res) {
    var uid = req.session.user.uid;
    pg.connect(connectionString, function(err, client) {
        if(err) {
            console.log(err.message);
            return null;
        }
        client.query("SELECT * FROM usertask_unfinished($1)", [uid], function(err, result) {
            if(err) {
                console.log(err.message);
                return res.redirect('/home');
            }
            if(result.rowCount > 0) {
                var mytasks = [];
                for (var i = 0; i <result.rowCount; i++) {
                    var mytask = new Task({
                        name: result.rows[i].taskname,
                        des: result.rows[i].taskdes,
                        startday: moment(result.rows[i].startdate).format('LL'),
                        endday: moment(result.rows[i].enddate).format('LL'),
                        projectname: result.rows[i].projectname,
                        teamname: result.rows[i].teamname,
                        remainday: result.rows[i].remainday,
                        taskid: result.rows[i].taskid
                    });
                    mytasks.push(mytask);
                }
                client.query("SELECT * FROM userproject_unfinished($1)", [uid], function (err, result) {
                    if (err) {
                        console.log(err.message);
                        return res.redirect('/home');
                    }
                    if (result.rowCount > 0) {
                        var myprojects = [];
                        for (var i = 0; i <result.rowCount; i++) {
                            var myproject = new Project({
                                name: result.rows[i].project_name,
                                des: result.rows[i].project_des,
                                owner: result.rows[i].project_owner,
                                startday: moment(result.rows[i].setup_day).format('LL'),
                                endday: moment(result.rows[i].closing_day).format('LL'),
                                teamname: result.rows[i].team_name,
                                projectid: result.rows[i].projectid,
                                remainday: result.rows[i].remainday
                            });
                            myprojects.push(myproject);
                        }
                        client.query("SELECT * FROM userteam_undisbanded($1)", [uid], function (err, result) {
                            if (err) {
                                console.log(err.message);
                                return res.redirect('/home');
                            }
                            if (result.rowCount > 0) {
                                var myteams = [];
                                for (var i = 0; i <result.rowCount; i++) {
                                    var teamprojects = [];
                                    myprojects.forEach(function (project, j) {
                                        if (project.teamname == result.rows[i].team_name) {
                                            teamprojects.push(project);
                                        }
                                    });
                                    var myteam = new Team({
                                        name: result.rows[i].team_name,
                                        des: result.rows[i].team_des,
                                        owner: result.rows[i].team_owner,
                                        startday: result.rows[i].setup_day,
                                        teamid: result.rows[i].teamid,
                                        projects: teamprojects
                                    });
                                    myteams.push(myteam);
                                }
                                res.render('user', {title: req.session.user.truename + '的主页', user: req.session.user.truename, id: 'user', teams: myteams, projects: myprojects, tasks: mytasks});
                            }
                        });
                    }
                });
            }
        });
//        query.on('error', function(err) {
//            console.log(err.message);
//            return null;
//        });
//        query.on('row', function(row, result) {
//            result.addRow(row);
//        });
//        query.on('end', function(result) {
//            if(result.rowCount > 0) {
//                var myteams=[];
//                for(var i = result.rowCount-1;i>=0;i--) {
//                    var myteam = new Team ({
//                        name: result.rows[i].team_name,
//                        des: result.rows[i].team_des,
//                        owner: result.rows[i].team_owner,
//                        startday: result.rows[i].setup_day,
//                        teamid: result.rows[i].teamid
//                    });
//                    myteams.push(myteam);
//                }
//                res.render('user', {title: req.session.user.name + '的主页', id: 'user', teams: myteams});
//            }
//            return null;
//        });
    });
};


exports.task = function(req, res) {
    var taskid = req.params.taskid;
    pg.connect(connectionString, function(err, client) {
        if(err) {
            console.log(err.messgae);
            return res.redirect('/home');
        }
        client.query('SELECT * FROM task_info($1)', [taskid], function(err, result) {
            if(err) {
                console.log(err.messgae);
                return res.redirect('/home');
            }
            if(result.rowCount > 0) {
                var task = new Task({
                    name: result.rows[0].taskname,
                    des: result.rows[0].des,
                    startday: moment(result.rows[0].startdate).format('LL'),
                    endday: moment(result.rows[0].endday).format('LL'),
                    projectname: result.rows[0].proname,
                    projectid: result.rows[0].proid,
                    teamname: result.rows[0].teamname,
                    teamid: result.rows[0].teamid,
                    remainday: result.rows[0].remaindays,
                    taskid: taskid,
                    complete: result.rows[0].complete
                });
                if(task.endday == "Invalid date") {
                    task.endday = "无期限";
                }
                client.query("SELECT * FROM task_user($1)", [taskid], function(err, result) {
                    if(err) {
                        console.log(err.message);
                        return res.redirect('/home');
                    }
                    if(result.rowCount > 0) {
                        var myusers=[];
                        for(var i=0;i<result.rowCount;i++) {
                            var myuser = new User({
                                name: result.rows[i].uname,
                                uid: result.rows[i].uid
                            });
                            myusers.push(myuser);
                        }
                        client.query("SELECT * FROM task_discuss($1)", [taskid], function(err, result) {
                            if(err) {
                                console.log(err.message);
                                return res.redirect('/home');
                            }
                            if(result.rowCount > 0) {
                                console.log(result);
                                var mydiscusses=[];
                                for(var i=result.rowCount-1;i>=0;i--) {
                                    var mydiscuss=new Discuss({
                                        username: result.rows[i].uname,
                                        uid: result.rows[i].uid,
                                        content: result.rows[i].discont,
                                        time: moment(result.rows[i].distime).format('YYYY年MMMDo ahh:mm:ss'),
                                        discussid: result.rows[i].disid
                                    });
                                    mydiscusses.push(mydiscuss);
                                }
                            }
                            res.render('task', {title: '任务：'+task.name, user: req.session.user.truename, id: 'user', task: task, users: myusers, discusses: mydiscusses});

                        });
                    }
                });
                //console.log(result);
            } else {
                req.flash('error', '该任务不存在！');
                return res.redirect('/home');
            }
        });
    });
};

exports.discuss = function(req, res) {
    var content=req.body.discuss;
    var taskid=req.body.taskid;
    pg.connect(connectionString, function(err, client) {
        if(err) {
            console.log(err.messgae);
            return res.redirect('/home');
        }
        client.query('SELECT * FROM newdiscuss($1,$2,$3)', [req.session.user.uid,taskid,content], function(err, result) {
            if(err) {
                console.log(err.messgae);
                return res.redirect(req.path);
            }
            console.log(result);
            return res.redirect(req.path);
        });
    });
};

exports.project = function(req, res) {
    var projectid = req.params.projectid;
    pg.connect(connectionString, function(err, client) {
        if(err) {
            console.log(err.messgae);
            return res.redirect('/home');
        }
        client.query('SELECT * FROM project_info($1)', [projectid], function(err, result) {
            if (err) {
                console.log(err.messgae);
                return res.redirect('/home');
            }
            if (result.rowCount > 0) {
                var myproject = new Project({
                    name: result.rows[0].pname,
                    des: result.rows[0].des,
                    owner: result.rows[0].ownerid,
                    ownername: result.rows[0].ownername,
                    startday: moment(result.rows[0].startdate).format('LL'),
                    endday: moment(result.rows[0].enddate).format('LL'),
                    teamname: result.rows[0].teamname,
                    teamid: result.rows[0].teamid,
                    projectid: projectid,
                });
                if(myproject.endday == "Invalid date") {
                    myproject.endday = "无期限";
                }
                //client.query();
                res.render('project', {title: '项目：'+myproject.name, user: req.session.user.truename, id: 'user', project: myproject});
            } else {
                req.flash('error', '该项目不存在！');
                return res.redirect('/home');
            }
        });
    });
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