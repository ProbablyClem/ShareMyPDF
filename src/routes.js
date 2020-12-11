var multer = require('multer');
var upload = multer({dest:'uploads/'});

var salons = require('./index');
const Salon = require('./Salon');

function genCode(){
  let length = 6;
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function routesSetup(app){
    //page accueil
app.get('/', (req, res) => res.sendFile(__dirname + "/public/vues/accueil.html"));

//setPseudo
app.post('/setPseudo',(req,res)=>{
  //console.log("Pseudo :"+req.body.pseudo)
  const pseudo = req.body.pseudo;
  if(req.body.join==null){
    res.render("vues/createRoom", {username : pseudo});
  }else{
    res.render('vues/joinRoom', {username : pseudo});
  }
  res.end()
});

//getCode
app.post('/getCode',(req,res)=>{
  console.log("Code :"+req.body.code)
  const code = req.body.code;
  const pseudo = req.body.pseudo;
  if(salons[code] != undefined){
    res.render("lecteur", {salon: code, username: pseudo, pdf: salons[code].pdf});
  }
  else{
    res.send("Le salon "+code+" n'existe pas!");
  }
  
  res.end()
});

//getParametre
app.get('/room/:room',(req,res)=>{
  const code = req.params.room;
  console.log("Code :"+code);
  if(salons[code] != undefined){
    res.render("vues/param", {code : code});
  }
  else{
    res.send("Le salon "+code+" n'existe pas!");
  }
  res.render("vues/param", {code : code});
});

//setPseudo2
app.post('/param',(req,res)=>{
  //console.log("Pseudo :"+req.body.pseudo);
  const pseudo = req.body.pseudo;
  const code = req.body.code;
  res.render("lecteur", {salon: code, username: pseudo, pdf: salons[code].pdf });
  res.end()
})

////////////////////////////////////////////////////////////////////////////////
//Upload
/*
app.post('/setPDF', (req, res) => {
  console.log(req.files);
  console.log(req.file);
  if(!req.files.f){
    res.send(400);
  }
  console.log(req.files.f);
  fName = req.files.f.name;
  const pseudo = req.body.pseudo;
  let avatar = req.files.f;
  const pdf = req.files.f.name;
  avatar.mv('public/uploads/' + avatar.name);
  let code = genCode();
  let salon = new Salon(pdf, code, req.ip, pseudo);
  salons[code] = salon;
  console.log(salons);
  res.render("presentateur", {salon : code, username: pseudo, pdf : pdf});
  res.end();
});*/

app.post('/setPdf', function (req, res) {
  var busboy = new Busboy({ headers: req.headers });
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

    var saveTo = path.join(__dirname, 'uploads/' + filename);
    file.pipe(fs.createWriteStream(saveTo));
    
  });
  const pdf = req.files.f.name;
  const pseudo = req.body.pseudo;
  let avatar = req.files.f;
  avatar.mv('public/uploads/' + avatar.name);
  let code = genCode();
  let salon = new Salon(pdf, code, req.ip, pseudo);
  salons[code] = salon;
  res.render("presentateur", {salon : code, username: pseudo, pdf : pdf});
  res.end(); 
});

////////////////////////////////////////////////////////////////////////////////

//tests
app.get("/lecteur", (req,res) =>{
  res.render("lecteur", {salon: 1234, username: "lecteur", pdf: "example.pdf"});
})

app.get("/presentateur", (req,res) =>{
  let pdf = "example.pdf";
  let code = 1234;
  let pseudo = "clement";
  let ip = "127.0.0.1"
  let salon = new Salon(pdf, code, req.ip, pseudo);
  salons[code] = salon;
  res.render("presentateur", {salon: code, username: pseudo, pdf: pdf});
})
}

module.exports = routesSetup;