module.exports = {
    'GET /': async(ctx, next) => {
        ctx.render('index.html', {
            title: 'Welcome To My Blog'
        });
    },
    'GET /register': async(ctx, next) => {
        ctx.render('register.html', {
            title: 'This is register'
        });
    }
};