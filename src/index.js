var express = require('express');
var socket = require('socket.io');
var multer = require('multer');
var upload = multer({dest:'uploads/'});
var sizeof = require('object-sizeof');
const Salon = require('./Salon');
const routes = require('./routes');
var pageProf = 1;
let annotations = [];


app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
////////////////////////////////////////
const fileUpload = require('express-fileupload');
////////////////////////////////////////

var salons = Array();
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

routes(app);

module.exports = app;
module.exports = server;
module.exports = salons;