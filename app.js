var express = require('express');
var app = express.createServer();
var socket = require("socket.io");
var io = socket.listen(app);
var peopleOnline = 0;

Array.prototype.remove = function(item){
  for(var i=0;i<this.length;++i){
    if(item == this[i]) {
      this.splice(i,1);
    }
  }
}

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

app.use (
  express.static(__dirname + '/public')
);

var port = process.env.PORT || 3000;
app.listen(port);
var sockets = [];

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  sockets.push(socket);
  setListeners(socket);
  peopleOnline++;
  emitPeopleCount();
});

function setListeners(socket) {
    socket.on('line', function (data) {
            sendLine(data);
    });
    socket.on('disconnect', function() { 
      peopleOnline--; 
      emitPeopleCount();
      sockets.remove(socket);
      console.log(sockets.length);
    });
}

function emitPeopleCount() {
  for(var i=0;i<sockets.length;++i) {
      sockets[i].emit('people_count', { 'count': peopleOnline });
  }
}
function sendLine(data) {
    for(var i=0;i<sockets.length;++i) {
        sockets[i].emit('new_line', { 'line': data });
    }
}