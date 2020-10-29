var express = require('express');
var socket = require('socket.io');
app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');

var server = app.listen(3000, function(){
  console.log("Listen to request on port 3000");
});

app.use(bodyparser.urlencoded({extended: false}));
app.use(morgan('short'));
app.use(express.static('public'));

var io = socket(server);
io.on('connection', function(socket){
  console.log('made socket connection', socket.id);

  socket.on('page', function(data){
    console.log(parseInt(data)+1);
    io.sockets.emit('page', parseInt(data)+1);
  })
})





//redirection
app.get('/join',(req,res)=>{
  res.sendFile(__dirname +'/public/IHM/rejoindre.html');
});

//redirection
app.get('/create',(req,res)=>{
  res.sendFile(__dirname +'/public/IHM/creation.html');
});

//setPseudo
app.post('/setPseudo',(req,res)=>{
  console.log("Pseudo :"+req.body.pseudo)
  const pseudo = req.body.pseudo;
  if(req.body.join==null){
    res.redirect('/create');
  }else{
    res.redirect('/join');
  }
  res.end()
});


//getCode
app.post('/getCode',(req,res)=>{
  console.log("Code :"+req.body.code)
  const code = req.body.code;
  res.redirect('/getCode');
  res.end()
});

//getParametre
app.get('/IHM/:room',(req,res)=>{
  const code = req.params.room;
  console.log("Code :"+code);
  res.sendFile(__dirname + '/public/IHM/param.html');
});

app.post('/param',(req,res)=>{
  console.log("Pseudo :"+req.body.pseudo);
  const pseudo = req.body.pseudo;
  res.send(pseudo);
  res.end()
})






