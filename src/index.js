var express = require('express');
var socket = require('socket.io');
var multer = require('multer');
var upload = multer({dest:'uploads/'});
var sizeof = require('object-sizeof');
const Salon = require('./Salon');
const routes = require('./routes');
let annotations = [];


app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
////////////////////////////////////////
const fileUpload = require('express-fileupload');
//const formData = require("express-form-data");
////////////////////////////////////////

global.salons = {};
////////////////////////////////////////

var server = app.listen(3000, function(){
  console.log("Listen to request on port 3000");
});

app.use(bodyparser.urlencoded({extended: false}));
app.use(morgan('short'));

app.use(express.static('public'));
////////////////////////////////////////
app.use(fileUpload());


//app.use(formData.parse(options));
//app.use(formData.format());
//app.use(formData.stream());
//app.use(formData.union());

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
    io.to(data).emit('allAnnot', salons[parseInt(data)].annotations);
  })

  socket.on('clear', (data) => {
    salons[data].annotations[salons[data].pageProf - 1] = [];
    io.to(data).emit('clear');
  })

})

routes(app);

module.exports = app;
module.exports = server;
module.exports.salons = salons;
module.exports = io;