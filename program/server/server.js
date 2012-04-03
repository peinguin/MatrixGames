var http = require("http");
var io   = require('socket.io');
var url  = require("url");

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    route(handle, pathname, response, request);
  }

  http.createServer(onRequest).listen(8888);
  io.listen(http);
  
  io.sockets.on('connection', function (socket) {
    socket.on('symplex', function (data) {
      console.log(data);
    });
  });
  
  console.log("Server has started.");
}

exports.start = start;