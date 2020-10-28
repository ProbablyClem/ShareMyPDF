var socket = io.connect("http://localhost:3000");

//Query DOM
var pageNumber = document.getElementById("pageNumber");

socket.on('page', function(data){
    pageNumber.innerHTML = data;
})
