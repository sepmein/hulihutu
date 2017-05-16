const koa = require('koa');
const bodyparser = require('koa-bodyparser');

let getNextMove = require('./grpc-client');
let app = new koa();

app.use(bodyparser());
app.use(async function(ctx, next) {
    //    console.log(ctx.request.body);
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Accept, Access-Control-Allow-Headers');
    board = ctx.request.body;
    move = await getNextMove(board);
    //    console.log(move);
    ctx.body = move;
});

app.listen(3000);
