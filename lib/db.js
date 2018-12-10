const mysql = require('mysql'),
    config = require('./config');

const pool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database
});

let query = function(sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                connection.query(sql, values, (q_err, rows) => {
                    if (q_err) {
                        reject(q_err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    });
}

let user =
    `create table if not exists user(
     id BIGINT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     password VARCHAR(200) NOT NULL,
     email VARCHAR(100) NOT NULL,
     phone VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    );`;

let tweets =
    `create table if not exists tweets(
        id VARCHAR(50) NOT NULL,
        name VARCHAR(50) NOT NULL,
        title VARCHAR(100) NOT NULL,
        essay VARCHAR(400) NOT NULL,
        primary key (id)
    );`;

let createTable = function(sql) {
    return query(sql, []);
}

createTable(user);
createTable(tweets);
//登陆
exports.login = async(name, password) => {
        let s = `select * from user where name = '${name}' and password = '${password}'`;
        console.log(s);
        return query(s);
    }
    //查询姓名
exports.selectOne = async(name) => {
        let s = `select * from user where name = '${name}'`;
        console.log(s);
        return query(s);
    }
    //注册
exports.insertData = (value) => {
    let _sql = "insert into user set id = ?,name=?,password=?,email=?,phone=?;"
    console.log(_sql);
    return query(_sql, value);
}

//blog推文录入
exports.insertTweets = (value) => {
    var time = new Date().getTime();
    value.push(time);
    console.log('insert Values:', value);
    let sql1 = "insert into tweets set name=?,title=?,essay=?,id=?;";
    console.log(sql1);
    return query(sql1, value);
}

//blog推文显示全部
exports.selectAllTweets = async() => {
    let sql2 = "select * from tweets;";
    console.log(sql2);
    return query(sql2);
}

//blog推文删除
exports.deleteTweets = async(value) => {
        let sql3 = "delete from tweets where name = ? and title = ? and essay = ?;";
        return query(sql3, value);
    }
    //blog查询名字
exports.selectTweets = async(value) => {
    let s1 = `select name from tweets where title = ? and essay = ?;`;
    return query(s1, value);
}

//blog查询该人的所有tweets
exports.selectOneTweets = async(name) => {
    let st = `select * from tweets where name = ${name};`;
    return query(st);
}