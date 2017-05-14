const PROTO_PATH = __dirname + '/src/Hulihutu.proto';

const grpc = require('grpc')
let Hulihutu = grpc.load(PROTO_PATH).Hulihutu;
let client = new Hulihutu('localhost:50051', grpc.credentials.createInsecure());

function callback(error, move){
    console.log(move);
}

client.getNextMove({one:1}, callback);
