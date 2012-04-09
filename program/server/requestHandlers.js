function httpPorahuj(response, request){
    
    response.write("");
    response.end();
}

function socketPorahuj(socket, data){

    matrix = eval(data['matrix']);
    params = JSON.parse(data['params']);
    method = data['method'];
    
    var result = porahuj(matrix, method, params);
    
    if(method == 'graph'){
        result['output'] += require("./nodejs_paint_canvas_graph").nodejs_paint_canvas_graph(result['max'], result['min'], result['maxX'], result['targY'], matrix, result['n2']);
    }
    
    socket.emit('result', JSON.stringify(result) );
}

function socketPostFile(socket, data){

    var matrix_str = new Buffer(data.substr(37), 'base64').toString('utf8');
}

exports.httpPorahuj   = httpPorahuj;
exports.socketPorahuj = socketPorahuj;
exports.socketPostFile = socketPostFile;