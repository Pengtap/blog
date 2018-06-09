const nunjucks = require('nunjucks');

function createEnv(path, opt) {
    var autoescape = opt.autoescape === undefined ? true : opt.autoescape,
        noCache = opt.noCache || false,
        watch = opt.watch || false,
        throwOnUndefinded = opt.throwOnUndefinded || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path, {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefinded
            });

    if (opt.filters) {
        for (var f in opt.filters) {
            env.addFilter(f, opt.filters[f]);
        }
    }

    return env;
}

function templating(path, opt) {
    var env = createEnv(path, opt);
    return async(ctx, next) => {
        ctx.render = function(view, model) {
            ctx.response.body = env.render(view, Object.assign({}, model || {}, ctx.state || {}));
            ctx.response.type = 'text/html';
        };
        await next();
    };
}

module.exports = templating;