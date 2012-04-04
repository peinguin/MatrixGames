var http = require("http");
var url  = require("url");

function start(router, httpHandle, socketHandle) {
    function onRequest(request, response) {
      var pathname = url.parse(request.url).pathname;
      console.log("Request for " + pathname + " received.");
      router.httpRoute(httpHandle, pathname, response, request);
    }

    var app = http.createServer(onRequest).listen(8888);
    io = require('socket.io').listen(app);
    
    io.sockets.on('connection', function (socket) {
        router.socketRoute(socket, socketHandle);
    });
    
    console.log("Server has started.");
}

exports.start = start;