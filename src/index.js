var express = require('express');
var socket = require('socket.io');
app = express();

var server = app.listen(3000, function(){
  console.log("Listen to request on port 3000");
});

app.use(express.static('public'));

var io = socket(server);
io.on('connection', function(socket){

  socket.on('page', function(data){
    io.sockets.emit('page', parseInt(data));
  })
})
