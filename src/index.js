var express = require('express');
var socket = require('socket.io');
var pageProf = 1;

app = express();

var server = app.listen(3000, function(){
  console.log("Listen to request on port 3000");
});

app.use(express.static('public'));

var io = socket(server);
io.on('connection', function(socket){

  socket.emit('page', pageProf);
  console.log(pageProf);
  
  socket.on('page', function(data){
    io.sockets.emit('page', parseInt(data));
    pageProf = parseInt(data);
  })
})
