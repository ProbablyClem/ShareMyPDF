var express = require('express');
Busboy = require('busboy');
var socket = require('socket.io');
var sizeof = require('object-sizeof');

var path = require('path');
var fs = require('fs');

const Salon = require('./Salon');
const routes = require('./routes');
let annotations = [];


app = express();

const morgan = require('morgan');
////////////////////////////////////////
const fileUpload = require('express-fileupload');


////////////////////////////////////////

global.salons = {};
////////////////////////////////////////

var server = app.listen(3000, function(){
  console.log("Listen to request on port 3000");
});

//app.use(morgan('short'));

app.use(express.static('public'));
////////////////////////////////////////
app.use(fileUpload());
////////////////////////////////////////

//Set view engine to ejs
app.set("view engine", "ejs"); 
app.set("views", __dirname + "/public"); 

global.io = socket(server, {cookie: false});
io.on('connection', function(socket){

  socket.on('login', (data)=>{
    salons[data.room].addMembre(data.pseudo, socket.id);
    socket.join(data.room);
  });

  socket.on('page', function(data){
    salons[data.room].setPage(parseInt(data.page));
    if (salons[data.room].annotations[parseInt(data.page)-1] === undefined) {
      salons[data.room].annotations[parseInt(data.page)-1] = [];
    }
  })

  socket.on('getPage', function(data){
    io.to(data).emit('page', salons[data].pageProf);
  })
  
  socket.on('annotPoint', (data) => {
    let salon = salons[data.room];
    io.to(data.room).emit('annotPoint', data.data);
    salon.annotations[salon.pageProf-1][salon.annotations[salon.pageProf-1].length] = [];
    salon.annotations[salon.pageProf-1][salon.annotations[salon.pageProf-1].length - 1].push(data.data);
  })

  socket.on('annotLine', (data) => {
    io.to(data.room).emit('annotLine', data.data);
    let salon = salons[data.room];
    salon.annotations[salon.pageProf-1][salon.annotations[salon.pageProf-1].length - 1].push(data.data)
  })

  socket.on('getAllAnnot', (data) => {
    io.to(data).emit('allAnnot', salons[data].annotations);
  })

  socket.on('getMembres', (data) =>{
    io.to(data).emit('membres', {pres: salons[data].presentateurPseudo, membres: salons[data].membres});
  })
  
  socket.on('clear', (data) => {
    salons[data].annotations[salons[data].pageProf - 1] = [];
    io.to(data).emit('clear');
  })

  socket.on('QuestionItems', (data) =>{
    //let salon = getSalon(socket.id);
    //console.log("Question bien envoyée à "+salon+" !");
    io.to(data.Salon).emit('QuestionItems',data);
    console.log("Nom de la question : "+data.leNom+"\nItems : ");
    data.lesItems.forEach(props => {
        console.log(props.intitule);
    });
    console.log("Bonne réponse : "+data.lesItems[data.bonneRep].intitule);
  })

  socket.on('QuestionsAEnvoyer', (data) => {
    console.log("Test Recevoir question");
    io.sockets.emit('messages',data);
    console.log("Sujet: "+data.leSujet+" Contenu: "+data.leContenu);
  })

  socket.on('ReponseChoisie', (data) => {
    // Récupération de l'objet de la question -> Récupération du props choisi (par id) -> Incrémentation de ce props
    io.to(data.Salon).emit('ReponseChoisie',data);
    console.log("Réponse "+data.idRepChoisie+" envoyée !");
    console.log(data);
  })

  socket.on('disconnect', () =>{
    let salon =getSalon(socket.id);
    console.log("Decconexion du salon: "+ salon);
    if (salon != 0){
      salons[salon].rmMembre(socket.id);
      if (salons[salon].estVide() && salon != "1234"){
        console.log("Supprime salon");
        //suprime pdf
        try {
          fs.unlinkSync("public/uploads/"+salons[salon].pdf);
        } catch(err) {
          console.error(err)
        }
        salons[salon].delete; //suprime salon
      }
    }
  })

})

//renvoi le salon associé a ce socket
function getSalon(id){
  for (const [key, value] of Object.entries(salons)) {
    console.log("Value.presentateurId = "+value.presentateurId+"\nId = "+id);
    if(Object.values(value.membres).indexOf(id) > -1 || value.presentateurId == id){
      return key;
    }
  }
  return "0";
}


routes(app);

module.exports = app;
module.exports = server;
module.exports.salons = salons;
module.exports = io;