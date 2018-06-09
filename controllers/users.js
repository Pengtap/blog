const db = require('../lib/db');
const md5 = require('md5');

module.exports = {
    'POST /signin': async(ctx, next) => {
        var name = ctx.request.body.name || '',
            password = md5(ctx.request.body.password || '');

        await db.login(name, password)
            .then(async res => {
                if (res.length && name === res[0]['name'] && password === res[0]['password']) {
                    console.log('Signin Ok!', res);
                    ctx.render('signin-ok.html', {
                        title: 'My blog',
                        name: name
                    });
                } else {
                    console.log('Signin False...', res);
                    ctx.render('signin-failed.html', {
                        title: 'Sign in false'
                    });
                }

            }).catch(rea => {
                console.log(err);
            });
    },
    'POST /': async(ctx, next) => {
        var name = ctx.request.body.name || '',
            password = md5(ctx.request.body.password || ''),
            repassword = md5(ctx.request.body.repassword || ''),
            email = ctx.request.body.email || '',
            phone = ctx.request.body.phone || '';

        await db.selectOne(name)
            .then(async res => {
                if (repassword !== password) {
                    console.log('password is error...');
                } else {
                    if (res.length) {
                        console.log('username have already exist...');
                    } else {
                        var id = new Date().getTime();
                        await db.insertData([id, name, password, email, phone]).then(
                            res => {
                                console.log('register OK!', res);

                                ctx.render('index.html', {
                                    title: 'Welcome To My Blog'
                                });
                            }
                        )
                    }
                }
            })
    }
};