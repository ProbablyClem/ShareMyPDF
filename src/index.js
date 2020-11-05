var express = require('express');
var socket = require('socket.io');
var multer = require('multer');
var upload = multer({dest:'uploads/'});
var pageProf = 1;

app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
////////////////////////////////////////
const fileUpload = require('express-fileupload');
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
app.get('/', (req, res) => res.sendFile(__dirname + "/public/vues/accueil.html"));

//redirection
app.get('/join',(req,res)=>{
  res.sendFile(__dirname +'/public/vues/Rejoindre.html');
});

app.get('/poeme',(req,res)=>{
  res.send("Jsuis frais t'es fraiche,<br>La distance entre nous s'affaisse,<br>Accepterais tu que je te mange les fesses?<br><button type =\"button\">Non</button>   <button type =\"button\">Oui</button>");
});

//redirection
app.get('/create',(req,res)=>{
  res.sendFile(__dirname +'/public/vues/Creation.html');
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
  res.render("eleve", {salon: code, username: "clement"});
  res.end()
});

//getParametre
app.get('/vues/:room',(req,res)=>{
  const code = req.params.room;
  console.log("Code :"+code);
  res.sendFile(__dirname + '/public/vues/param.html');
});

//setPseudo2
app.post('/param',(req,res)=>{
  console.log("Pseudo :"+req.body.pseudo);
  const pseudo = req.body.pseudo;
  res.send(pseudo);
  res.end()
})

////////////////////////////////////////////////////////////////////////////////
//Upload
app.post('/getPDF', upload.single('profile'), (req, res) => {
  res.redirect('/poeme');
  console.log(req.files.f);
  let avatar = req.files.f;
  avatar.mv('uploads/' + avatar.name);
});
////////////////////////////////////////////////////////////////////////////////

//tests
app.get("/eleve", (req,res) =>{
  res.render("eleve", {salon: 1234, username: "clement"});
})

app.get("/prof", (req,res) =>{
  res.render("presentateur", {salon: 1234, username: "clement"});
})

module.exports = app;
module.exports = server;