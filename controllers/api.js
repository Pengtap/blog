const APIError = require('../rest').APIError;
const db = require('../lib/db');

var gid = 0;

function nextId() {
    gid++;
    return 't' + gid;
}

var todos = [];

db.selectAllTweets()
    .then(res => {
        var string = JSON.stringify(res);
        var data = JSON.parse(string);

        data.forEach((t) => {
            todo = {
                id: nextId(),
                name: t.name.trim(),
                title: t.title.trim(),
                essay: t.essay.trim()
            };
            todos.push(todo);
        });
    })
    .catch(rea => {
        console.log('Todos error:', err);
    });


module.exports = {
    'GET /api/todos': async(ctx, next) => {
        console.log('Todos:', todos);
        ctx.rest({
            todos: todos
        });
    },

    'POST /api/todos': async(ctx, next) => {
        var
            t = ctx.request.body,
            todo3;
        if (!t.name || !t.name.trim()) {
            throw new APIError('invalid_input', 'Missing name');
        }
        if (!t.title || !t.title.trim()) {
            throw new APIError('invalid_input', 'Missing title');
        }
        if (!t.essay || !t.essay.trim()) {
            throw new APIError('invalid_input', 'Missing essay');
        }
        todo3 = {
            id: nextId(),
            name: t.name.trim(),
            title: t.title.trim(),
            essay: t.essay.trim()
        };
        console.log('Todo3:', todo3);
        todos.push(todo3);
        ctx.rest(todo3);

        console.log('Todo3:')
        await db.insertTweets([todo3.name, todo3.title, todo3.essay])
            .then(res => {
                console.log('Tweets insert OK!');
            }).catch(rea => {
                console.log('Tweets insert error:', err);
            });
    },
    /*
        'PUT /api/todos/:id': async(ctx, next) => {
            var
                t = ctx.request.body,
                index = -1,
                i, todo2;

            if (!t.name || !t.name.trim()) {
                throw new APIError('invalid_input', 'Missing name');
            }
            if (!t.title || !t.title.trim()) {
                throw new APIError('invalid_input', 'Missing title');
            }
            if (!t.essay || !t.essay.trim()) {
                throw new APIError('invalid_input', 'Missing essay');
            }
            for (i = 0; i < todos.length; i++) {
                if (todos[i].id === ctx.params.id) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                throw new APIError('notfound', 'Todo not found by id: ' + ctx.params.id);
            }
            todo2 = todos[index];
            todo2.name = t.name.trim();
            todo2.title = t.title.trim();
            todo2.essay = t.essay.trim();
            ctx.rest(todo2);

        },*/
    'DELETE /api/todos/:id/:rename': async(ctx, next) => {
        var i, index = -1,
            ans = 0;
        for (i = 0; i < todos.length; i++) {
            if (todos[i].id === ctx.params.id) {
                index = i;
                break;
            }
        }
        if (index === -1) {
            throw new APIError('notfound', 'Todo not found by id: ' + ctx.params.id);
        }

        var todod = todos[index];

        if (todod.name === ctx.params.rename) {
            await db.deleteTweets([todod.name, todod.title, todod.essay]).then(res => {
                console.log('Delete tweets OK!');
                ans = 1;
            }).catch(rea => {
                console.log('Delete tweets False...', err);
                ans = 0;
            })
        } else {
            ans = 0;
            console.log('You can not delete it!');
        }


        if (ans)
            ctx.rest(todos.splice(index, 1)[0]);
    }

}