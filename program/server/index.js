var fs = require('fs');
var vm = require('vm');
var includeInThisContext = function(path) {
    var code = fs.readFileSync(path);
    vm.runInThisContext(code, path);
}.bind(this);
//includeInThisContext(__dirname+"/models/car.js");

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var httpHandle = {};
var socketHandle = {}
httpHandle["/porahuj"] = requestHandlers.httpPorahuj;
socketHandle["porahuj"] = requestHandlers.socketPorahuj;

server.start(router, httpHandle, socketHandle);