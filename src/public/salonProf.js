var socket = io.connect("http://localhost:3000");

//Query DOM
var pageNumber = document.getElementById("pageNumber");
var button = document.getElementById('button');

button.addEventListener('click', function(){
    console.log(pageNumber.innerText);
    socket.emit("page", pageNumber.innerHTML);
})

socket.on('page', function(data){
    pageNumber.innerHTML = data;
})
