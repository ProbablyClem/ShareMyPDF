import { socket } from "./socket.js";

socket.on('questionEleve',function(data){
    console.log("question recu");
    console.log(data);
    renderHtml(data);
});

function renderHtml(data){
    var listeQuestions = document.getElementById('listeQuestions');
    var li = document.createElement("li");
    var span1 = document.createElement("span");
    var span2 = document.createElement("span");
    var boutonQuitter = document.createElement("button");

    span1.innerHTML = data.leSujet;
    span2.innerHTML = '</br>' + data.leContenu;
    boutonQuitter.innerHTML = "x";
    li.appendChild(span1);
    li.appendChild(boutonQuitter);
    li.appendChild(span2);
    boutonQuitter.addEventListener("click", ()=>{
        listeQuestions.removeChild(li);
    })
    listeQuestions.insertBefore(li, listeQuestions.firstChild);

    console.log(listeQuestions.childElementCount);
    if(listeQuestions.childElementCount > 15){
        listeQuestions.removeChild(listeQuestions.lastChild);
    }
}

socket.emit("getAllQuestionsEleve", document.getElementById("room").innerHTML);