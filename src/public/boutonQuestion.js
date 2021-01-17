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
    socket.emit('QuestionsAEnvoyer', {leSujet: sujet , leContenu: contenu, pseudo : username, room : room});
});

const card = document.getElementById('questionCard');
const toggle = document.getElementById('questionToggle');

function showQuestion() {
    card.style.display = 'block';
    toggle.style.display = 'none';
}

function hideQuestion() {
    card.style.display = 'none';
    toggle.style.display = 'block';
}

toggle.addEventListener('click', showQuestion);
document.getElementById('closeQuestion').addEventListener('click', hideQuestion);