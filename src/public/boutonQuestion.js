import { socket } from "./socket.js";

var submit = document.getElementById("envoyer");
let username = document.getElementById("username").innerHTML;
let room = document.getElementById("room").innerHTML;

submit.addEventListener("click", (event)=>{
    event.preventDefault();

    let myForm = document.getElementById('myForm');
    let fd = new FormData(myForm);

    var sujet = fd.get('sujet');
    var contenu = fd.get('contenuQuestion');

    console.log(sujet);
    console.log(contenu);
    if(document.getElementById('sujet').value == "" || document.getElementById('contenuQuestion').value == ""){
        alert("Veuillez remplir tout les champs");
    }
    else{
        document.getElementById('sujet').value = "";
        document.getElementById('contenuQuestion').value = "";
        socket.emit('QuestionsAEnvoyer', {leSujet: sujet , leContenu: contenu, pseudo : username, room : room});
    }
});




