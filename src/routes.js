var multer = require('multer');
var upload = multer({dest:'uploads/'});
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
app.post('/login',(req,res)=>{
  //console.log("Pseudo :"+req.body.pseudo)
  const pseudo = req.body.pseudo;
  if(req.body.join==null){
    const code =genCode();
    res.render("vues/createRoom", {salon: code, username : pseudo});
  }else{
    res.render('vues/joinRoom', {username : pseudo});
  }
  res.end()
});

app.post('/lecteur',(req,res)=>{
  //console.log("Code :"+req.body.code)
  const code = req.body.code;
  const pseudo = req.body.pseudo;
  if(salons[code] != undefined && salons[code].presentateurPseudo == pseudo){
    if(salons[code].presentateurIp == req.ip){
      res.render("presentateur", {salon : code, username: pseudo, pdf : salons[code].pdf});
    }
    else{
      res.send("Le pseudo "+pseudo+" est deja pris pour le salon " + code + "!");
    }
  }
  if(salons[code] != undefined){
    res.render("lecteur", {salon: code, username: pseudo, pdf: salons[code].pdf});
  }
  else{
    res.send("Le salon "+code+" n'existe pas!");
  }
  
  res.end()
});
/*
app.post('/param',(req,res)=>{
  const pseudo = req.body.pseudo;
  const code = req.body.code;
  res.render("lecteur", {salon: code, username: pseudo, pdf: salons[code].pdf });
  res.end();
})
*/
//getParametre
app.get('/room/:room',(req,res)=>{
  const code = req.params.room;
  //console.log("Code :"+code);
  if(salons[code] != undefined){
    res.render("vues/param", {code : code});
  }
  else{
    res.send("Le salon "+code+" n'existe pas!");
  }
  res.render("vues/param", {code : code});
  res.end();
});



//getQuizzProf
app.get('/quizzProf',(req,res)=>{
  let room = req.query.room;  // true
  res.render("quizzProf.ejs", {salon : room});
});


app.post('/setPdf', function (req, res) {
  var busboy = new Busboy({ headers: req.headers });
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

    var saveTo = path.join(__dirname, 'uploads/' + filename);
    file.pipe(fs.createWriteStream(saveTo));
    
  });
  const pdf = req.files.f.name;
  const pseudo = req.body.pseudo;
  const code = req.body.code;
  let avatar = req.files.f;
  avatar.mv('public/uploads/' + avatar.name);
  let salon = new Salon(pdf, code, req.ip, pseudo);
  salons[code] = salon;
  res.redirect(307, '/presentateur')
  res.end(); 
});

app.post('/presentateur', (req, res) => {
  const code = req.body.code;
  const pseudo = req.body.pseudo;
  const pdf  = req.files.f.name;
  console.log(code , pseudo, pdf);
  res.render("presentateur", {salon : code, username: pseudo, pdf : pdf});
})

////////////////////////////////////////////////////////////////////////////////

//tests
app.get("/lec", (req,res) =>{
  res.render("lecteur", {salon: 1234, username: "lecteur", pdf: "example.pdf"});
})

app.get("/pres", (req,res) =>{
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