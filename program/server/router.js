function httpRoute(handle, pathname, response, request) {
  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request);
  } else {
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write("404 Not found");
    response.end();
  }
}

function socketRoute(socket, socketHandle) {
    for(var action in socketHandle){
        socket.on(action, socketHandle[action](data));
    }
}

exports.httpRoute   = httpRoute;
exports.socketRoute = socketRoute;