function httpCalculate(response, request){
    
    response.write("");
    response.end();
}

function socketCalculate(socket, data){

    matrix = eval(data['matrix']);
    params = JSON.parse(data['params']);
    method = data['method'];
    
    var result = calculate(matrix, method, params);
    
    if(method == 'graph'){
        result['output'] += require("./nodejs_paint_canvas_graph").nodejs_paint_canvas_graph(result['max'], result['min'], result['maxX'], result['targY'], matrix, result['n2']);
    }
    
    socket.emit('result', JSON.stringify(result) );
}

function socketPostFile(socket, data){
    if(typeof(data) == 'string'){
        data = eval('(' + data + ')');
        
        var matrix_str = new Buffer(data['matrix'].substr(37), 'base64').toString('utf8');
        var matrix = matrix_str.split("\n");
   
        for(i=0;i<matrix.length;i++)
            matrix[i] = matrix[i].split(" ");
    }else{
        var matrix = eval(data['matrix']);
    }
    
    
    params = JSON.parse(data['params']);
    method = data['method'];

    var result = calculate(matrix, method, params);
    
    if(method == 'graph'){
        result['output'] += require("./nodejs_paint_canvas_graph").nodejs_paint_canvas_graph(result['max'], result['min'], result['maxX'], result['targY'], matrix, result['n2']);
    }
    
    socket.emit('result', JSON.stringify(result) );
}

exports.httpCalculate   = httpCalculate;
exports.socketCalculate = socketCalculate;
exports.socketPostFile = socketPostFile;