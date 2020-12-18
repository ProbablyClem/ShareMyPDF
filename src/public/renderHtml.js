import { socket } from "./socket.js";

socket.on('messages',function(data){
    console.log(data);
    renderHtml(data);
});

function renderHtml(data){
    var listeQuestions = document.getElementById('listeQuestions');
    var li = document.createElement("li");
    var span1 = document.createElement("span");
    var span2 = document.createElement("span");

    span1.innerHTML = data.leSujet+'</br>';
    span2.innerHTML = data.leContenu;

    li.appendChild(span1);
    li.appendChild(span2);
    listeQuestions.appendChild(li);
}