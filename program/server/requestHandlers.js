function httpPorahuj(response, request){
    
    response.write("");
    response.end();
}

function socketPorahuj(socket, data){

    matrix = eval(data['matrix']);
    params = JSON.parse(data['params']);
    method = data['method'];
    
    var result = porahuj(matrix, method, params);
    
    socket.emit('result', JSON.stringify(result) );
}

exports.httpPorahuj   = httpPorahuj;
exports.socketPorahuj = socketPorahuj;