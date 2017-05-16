const PROTO_PATH = __dirname + '/../../src/Hulihutu.proto';
const grpc = require('grpc');

let Hulihutu = grpc.load(PROTO_PATH).Hulihutu;
let client = new Hulihutu('localhost:50051', grpc.credentials.createInsecure());

module.exports = function getNextMove(board){
    return new Promise(function(resolve, reject){
        console.log(board);
        client.getNextMove(board, function(error, move){
            if(!error) {
                resolve(move);
            } else {
                reject(error);
            }
        }); 
    });
}
