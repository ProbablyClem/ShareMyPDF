import { socket } from "./socket.js";

socket.on('questionEleve',function(data){
    console.log("question recu");
    console.log(data);
    renderHtml(data);
});

function renderHtml(data){
    var listeQuestions = document.getElementById('listeQuestions');

    var card = document.createElement("div");
    card.classList.add('card', 'my-3');

    var cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between');

    var pseudo = document.createElement('strong');
    pseudo.innerText = data.pseudo;

    var time = document.createElement('small');
    var ts = new Date();
    time.classList.add('text-muted');
    const h = ts.getHours();
    const m = ts.getMinutes();
    time.innerText = (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);

    var closeBtn = document.createElement('button');
    closeBtn.classList.add('btn-close');

    var cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    var sujet = document.createElement('span');
    sujet.classList.add('h4', 'd-block');
    sujet.innerText = data.leSujet;

    var texte = document.createElement('span');
    texte.innerText = data.leContenu;

    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    cardHeader.appendChild(pseudo);
    cardHeader.appendChild(time);
    cardHeader.appendChild(closeBtn);
    cardBody.appendChild(sujet)
    cardBody.appendChild(texte);

    closeBtn.addEventListener("click", ()=>{
        listeQuestions.removeChild(card);
    })

    listeQuestions.appendChild(card);

    console.log(listeQuestions.childElementCount);
    if(listeQuestions.childElementCount > 4){
        listeQuestions.removeChild(listeQuestions.firstChild);
    }
}

socket.emit("getAllQuestionsEleve", document.getElementById("room").innerHTML);