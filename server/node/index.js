const koa = require('koa');
const bodyparser = require('koa-bodyparser');
const Router = require('koa-router');
const MongoClient = require('mongodb').MongoClient;

const mongoUrl = "mongodb://localhost:27017/tictac"

let getNextMove = require('./grpc-client');
let app = new koa();

let router = new Router();

router.get('/', function(ctx, next) {
    ctx.body = 'hello';
    next();
});

function getStats(){
    return new Promise(function(resolve, reject) {
        MongoClient.connect(mongoUrl, function(err, db){
            if(err) {
                reject(err);
                db.close();
            } else {
                collection = db.collection('statistics');
                collection.find({}).toArray( function(err, result){
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                    db.close();
                });
            }
        })
    });
}
router.get('/statistics', async function(ctx, next) {
    try {
        ctx.body = await getStats();
    } catch(error) {
        console.log(error);
        ctx.throw(500);
    }
});

function postStats(winner){
    return new Promise(function(resolve, reject) {
        MongoClient.connect(mongoUrl, function(err, db) {
            if(err) {
                reject(err);
                db.close();
            } else {
                collection = db.collection('statistics');
                collection.findOneAndUpdate({
                    winner: winner
                },{
                    $inc: {
                        count: 1
                    }
                }, {
                    upsert: true
                }, function(err, response){
                    if(err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                    db.close();
                });

            }
        })
    });
}
router.post('/statistics', async function(ctx, next) {
    try {
        let request = ctx.request.body;
        ctx.body = await postStats(request.winner);
    } catch (error) {
        ctx.throw(500);
    }
});

router.post('/ai', async function(ctx, next) {
    //    console.log(ctx.request.body);
    board = ctx.request.body;
    move = await getNextMove(board);
    //    console.log(move);
    ctx.body = move;
});

app.use(async function(ctx, next) {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Accept, Access-Control-Allow-Headers');
    await next();
});

app.use(bodyparser());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
