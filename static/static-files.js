const path = require('path'),
    mime = require('mime'),
    fs = require('mz/fs');

function staticFiles(url, dir) {
    return async(ctx, next) => {
        let p = ctx.request.path;
        if (p.startsWith(url)) {
            let fp = path.join(dir, p.substring(url.length));
            if (await fs.exists(fp)) {
                ctx.response.type = mime.getType(p);
                ctx.response.body = await fs.readFile(fp);
            } else {
                ctx.response.status = 404;
            }
        } else {
            await next();
        }
    }
}

module.exports = staticFiles;