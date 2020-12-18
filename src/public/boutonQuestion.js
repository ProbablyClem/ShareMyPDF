import { socket } from "./socket.js";

var submit = document.getElementById("envoyer");


submit.addEventListener("click", (event)=>{
    event.preventDefault();
    
    let myForm = document.getElementById('myForm');
    let fd = new FormData(myForm);

    var sujet = fd.get('sujet');
    var contenu = fd.get('contenuQuestion');

    console.log(sujet);
    console.log(contenu);
    socket.emit('QuestionsAEnvoyer', {leSujet: sujet , leContenu: contenu });
});

