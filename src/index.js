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
    console.log(salons);
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

  socket.on('clear', (data) => {
    salons[data].annotations[salons[data].pageProf - 1] = [];
    io.to(data).emit('clear');
  })

  socket.on('QuestionItems', (data) =>{
    console.log("Question bien envoyée !");
    io.sockets.emit('QuestionItems',data);
    console.log("Nom de la question : "+data.leNom+"\nIntitulés : "+data.lesItems+"\nBonne réponse : "+data.lesItems[data.bonneRep]);
  })
  socket.on('QuestionsAEnvoyer', (data) => {
    console.log("Test Recevoir question");
    io.sockets.emit('questionsEmmits',data);
    console.log("Sujet: "+data.leSujet+" Contenu: "+data.leContenu);
  })

})




routes(app);

module.exports = app;
module.exports = server;
module.exports.salons = salons;
module.exports = io;