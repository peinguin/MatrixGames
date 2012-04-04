function httpPorahuj(response, request){
    
    response.write("");
    response.end();
}

function socketPorahuj(data){
    console.log(data);
}

exports.httpPorahuj   = httpPorahuj;
exports.socketPorahuj = socketPorahuj;