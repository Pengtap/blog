const Koa = require('koa'),
    bodyParser = require('koa-bodyparser');

const controller = require('./controller'),
    templating = require('./views/templating'),
    static = require('./static/static-files'),
    rest = require('./rest');

const app = new Koa();

const isProduction = process.env.NODE_ENV === 'production';

//记录url及页面执行时间
app.use(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}`);
    var start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

//解析post请求
app.use(bodyParser());

//给ctx挂上render()来使用nunjucks
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

//处理静态文件
if (!isProduction) {
    app.use(static('/static/', __dirname + '/static'));
}

//将rest()绑定到ctx上
app.use(rest.restify());

//处理url路由
app.use(controller());

app.listen(8080);
console.log('app started at port 8080...');