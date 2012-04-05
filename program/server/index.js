var fs = require('fs');
var vm = require('vm');
var includeInThisContext = function(path) {
    var code = fs.readFileSync(path);
    vm.runInThisContext(code, path);
}.bind(this);
includeInThisContext(__dirname+"/../client/matrixgames/helpers.js");
includeInThisContext(__dirname+"/../client/matrixgames/symplex.js");
includeInThisContext(__dirname+"/../client/matrixgames/BraunRobinson.js");
includeInThisContext(__dirname+"/../client/matrixgames/Nx2xN.js");
includeInThisContext(__dirname+"/../client/matrixgames/porahuj.js");

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var httpHandle = {};
var socketHandle = {}
httpHandle["/porahuj"] = requestHandlers.httpPorahuj;
socketHandle["porahuj"] = requestHandlers.socketPorahuj;

server.start(router, httpHandle, socketHandle);