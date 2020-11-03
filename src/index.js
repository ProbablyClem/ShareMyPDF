var express = require('express');
var socket = require('socket.io');
var pageProf = 1;

app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');

var server = app.listen(3000, function(){
  console.log("Listen to request on port 3000");
});



app.use(bodyparser.urlencoded({extended: false}));
app.use(morgan('short'));

//Set view engine to ejs
app.set("view engine", "ejs"); 
app.set("views", __dirname + "/vues"); 

var io = socket(server);
io.on('connection', function(socket){
  console.log('made socket connection', socket.id);
  console.log(pageProf);
  
  socket.on('page', function(data){
    io.sockets.emit('page', parseInt(data));
    pageProf = parseInt(data);
  })

  socket.on('getPage', function(){
    console.log("getPage!");
    console.log(pageProf);
    socket.emit('page', pageProf);
  })

})

//page accueil
app.get('/', (req, res) => res.sendFile(__dirname + "/vues/accueil.html"));

//redirection
app.get('/join',(req,res)=>{
  res.sendFile(__dirname +'/vues/Rejoindre.html');
});

//redirection
app.get('/create',(req,res)=>{
  res.sendFile(__dirname +'/vues/Creation.html');
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
app.get('/vues/:room',(req,res)=>{
  const code = req.params.room;
  console.log("Code :"+code);
  res.sendFile(__dirname + '/vues/param.html');
});

app.post('/param',(req,res)=>{
  console.log("Pseudo :"+req.body.pseudo);
  const pseudo = req.body.pseudo;
  res.send(pseudo);
  res.end()
})






