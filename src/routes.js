var multer = require('multer');
var upload = multer({dest:'uploads/'});
var salons = require('./index').salons;

var pseudo;
var code;
var fName;

function routesSetup(app){
    //page accueil
app.get('/', (req, res) => res.sendFile(__dirname + "/public/vues/accueil.html"));

//redirection
app.get('/joinRoom',(req,res)=>{
  res.sendFile(__dirname +'/public/vues/joinRoom.html');
});

//redirection
app.get('/createRoom',(req,res)=>{
  cap
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
  res.render("eleve", {salon: 1234, username: "clement"});
})

app.get("/presentateur", (req,res) =>{
  res.render("presentateur", {salon: 1234, username: "clement"});
})
}

module.exports = routesSetup