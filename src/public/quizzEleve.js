import { socket } from "./socket.js";

let room = document.getElementById("room").innerHTML;

let titre_question = document.getElementById("IntituleQuestion");

let reponses = document.getElementById("elementsreponses");

let ensemble_label_input = [];

let question = document.createElement("h3");

let ib = [];
let input = [];
let label = [];

let envoyer = document.createElement("button");

let idQuestionEnCours;

for(var i = 0; i < 4; i++){
    input.push(document.createElement("input"));
    ib.push(document.createElement("div"));
    ib[i].appendChild(input[i]);
    ib[i].classList.add('input-group-text');
    input[i].classList.add('form-check-input');
    input[i].type = "radio";
    input[i].id = "item"+(i+1);
    input[i].name = "items";
    label.push(document.createElement("label"));
    label[i].classList.add('input-group-text', 'form-control');    
    label[i].id = "i"+i;
    label[i].for = "item"+(i+1);

    ensemble_label_input.push(document.createElement("div"));
    ensemble_label_input[i].classList.add('input-group', 'mb-2');
    ensemble_label_input[i].appendChild(ib[i]);
    ensemble_label_input[i].appendChild(label[i]);
}

function afficheQuestion(nomQuestion, items){
    document.getElementById("reponses").style.display = "block";
    document.getElementById("viewer").style.filter = "blur(10px)";
    question.innerText = nomQuestion;
    titre_question.appendChild(question);
    let i = 0;
    items.forEach(item => {
        input[i].value = item.intitule;

        label[i].innerText = item.intitule;

        reponses.appendChild(ensemble_label_input[i]);

        i++;
        /*<input type="radio" id="item1" name="items" value="item1">
        <label id="i1" for="item1"></label><br>*/
    });

    envoyer.innerText = "Envoyer la réponse";
    envoyer.classList.add('btn', 'btn-primary', 'mt-3');
    reponses.appendChild(envoyer);

}

function envoyerReponse(){
    i = 0;
    while(!input[i].checked && i < input[i].length){
        i++;
    }
    if(i == input.length){
        alert("Veuillez cocher une réponse !");
    }
    else{
        socket.emit('ReponseChoisie', {leNom: question.innerText, idRepChoisie: i, Salon: room, idQuestion: idQuestionEnCours});
        document.getElementById("reponses").style.display = "none";
        document.getElementById("viewer").style.filter = "blur(0px)";
    }
}

envoyer.addEventListener("click", envoyerReponse);


socket.on('QuestionItems', (data) =>{
    console.log(data);
    idQuestionEnCours = data.idQuestion;
    afficheQuestion(data.objectQuestion.nom, data.objectQuestion.props);
});


// A suppr après, il s'agit d'un test montrant qu'on peut rien renvoyer au présentateur
socket.on('ReponseChoisie', (data) =>{
    //allQuestions[data.idQuestion].props[data.idRepChoisie].addCompteur();
    console.log("RepChoisie : ");
    console.log(data);
});
