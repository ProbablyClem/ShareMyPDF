var express = require('express');
var socket = require('socket.io');
var multer = require('multer');
var upload = multer({dest:'uploads/'});
var sizeof = require('object-sizeof');
var pageProf = 1;
let annotations = [];


app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
////////////////////////////////////////
const fileUpload = require('express-fileupload');
////////////////////////////////////////
var pseudo;
var code;
var fName;
////////////////////////////////////////

var server = app.listen(3000, function(){
  console.log("Listen to request on port 3000");
});

app.use(bodyparser.urlencoded({extended: false}));
app.use(morgan('short'));

app.use(express.static('public'));
////////////////////////////////////////
app.use(fileUpload());
////////////////////////////////////////

//Set view engine to ejs
app.set("view engine", "ejs"); 
app.set("views", __dirname + "/public"); 

var io = socket(server, {cookie: false});
io.on('connection', function(socket){
  console.log('made socket connection', socket.id);
  
  socket.on('page', function(data){
    io.sockets.emit('page', parseInt(data));
    pageProf = parseInt(data);
    if (annotations[parseInt(data)-1] === undefined) {
      annotations[parseInt(data)-1] = [];
    }
  })

  socket.on('getPage', function(){
    socket.emit('page', pageProf);
    console.log("getPage, " + sizeof(pageProf) + "o envoyés");
  })
  
  socket.on('annotPoint', (data) => {
    io.sockets.emit('annotPoint', data);
    annotations[pageProf-1][annotations[pageProf-1].length] = [];
    annotations[pageProf-1][annotations[pageProf-1].length - 1].push(data);
  })

  socket.on('annotLine', (data) => {
    io.sockets.emit('annotLine', data);
    annotations[pageProf-1][annotations[pageProf-1].length - 1].push(data)
  })

  socket.on('getAllAnnot', () => {
    socket.emit('allAnnot', annotations);
    console.log('getAllAnnot, ' + sizeof(annotations) + 'o envoyés');
  })

  socket.on('clear', () => {
    console.log('clear' + pageProf);
    annotations[pageProf - 1] = [];
    io.sockets.emit('clear');
  })

})

//page accueil
app.get('/', (req, res) => res.sendFile(__dirname + "/public/vues/accueil.html"));

//redirection
app.get('/joinRoom',(req,res)=>{
  res.sendFile(__dirname +'/public/vues/joinRoom.html');
});

//redirection
app.get('/createRoom',(req,res)=>{
  res.sendFile(__dirname +'/public/vues/createRoom.html');
});

//setPseudo
app.post('/setPseudo',(req,res)=>{
  console.log("Pseudo :"+req.body.pseudo)
  pseudo = req.body.pseudo;
  if(req.body.join==null){
    res.redirect('/createRoom');
  }else{
    res.redirect('/joinRoom');
  }
  res.end()
});

//getCode
app.post('/getCode',(req,res)=>{
  console.log("Code :"+req.body.code)
  const code = req.body.code;
  res.render("eleve", {salon: code, username: pseudo});
  res.end()
});

//getParametre
app.get('/room/:room',(req,res)=>{
  code = req.params.room;
  console.log("Code :"+code);
  res.sendFile(__dirname + '/public/vues/param.html');
});

//setPseudo2
app.post('/param',(req,res)=>{
  console.log("Pseudo :"+req.body.pseudo);
  pseudo = req.body.pseudo;
  res.write("Pseudo : "+pseudo);
  res.write("\n");
  res.write("Code : "+code);
  res.end()
})

////////////////////////////////////////////////////////////////////////////////
//Upload
app.post('/setPDF', upload.single('profile'), (req, res) => {
  if(!req.files.f){
    res.send(400);
  }
  console.log(req.files.f);
  fName = req.files.f.name;
  let avatar = req.files.f;
  avatar.mv('uploads/' + avatar.name);
  res.send("Fichier : "+req.files.f.name + "<br> Pseudo : "+pseudo);
});
////////////////////////////////////////////////////////////////////////////////

//tests
app.get("/lecteur", (req,res) =>{
  res.render("lecteur", {salon: 1234, username: "clement"});
})

app.get("/presentateur", (req,res) =>{
  res.render("presentateur", {salon: 1234, username: "clement"});
})

module.exports = app;
module.exports = server;