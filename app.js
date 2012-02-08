var app = require('express').createServer()
  , io = require('socket.io').listen(app);


  io.configure(function () { 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
  });

var port = process.env.PORT || 3000;
app.listen(port);
var sockets = [];

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  sockets.push(socket);
  setListeners(socket);
});

function setListeners(socket) {
    socket.on('line', function (data) {
            sendLine(data);
    });
}

function sendLine(data) {
    for(var i=0;i<sockets.length;++i) {
        sockets[i].emit('new_line', { 'line': data });
    }
}