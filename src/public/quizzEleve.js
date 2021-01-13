import { socket } from "./socket.js";

let room = document.getElementById("room").innerHTML;

let titre_question = document.getElementById("IntituleQuestion");

let reponses = document.getElementById("elementsreponses");

let ensemble_label_input = [];

let question = document.createElement("h3");

let input = [];
let label = [];

let envoyer = document.createElement("button");

let idQuestionEnCours;

for(var i = 0; i < 4; i++){
    input.push(document.createElement("input"));
    input[i].type = "radio";
    input[i].id = "item"+(i+1);
    input[i].name = "items";
    label.push(document.createElement("label"));
    label[i].id = "i"+i;
    label[i].for = "item"+(i+1);

    ensemble_label_input.push(document.createElement("div"));
    ensemble_label_input[i].style.display = "block";
    ensemble_label_input[i].appendChild(input[i]);
    ensemble_label_input[i].appendChild(label[i]);
}

function afficheQuestion(nomQuestion, items){
    document.getElementById("reponses").style = "display: block";
    question.innerText = "Question : "+nomQuestion;
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
    reponses.appendChild(envoyer);

}

function envoyerReponse(){
    i = 0;
    while(!input[i].checked && i < input.length){
        i++;
    }
    if(i == input.length){
        alert("Veuillez cocher une réponse !");
    }
    else{
        socket.emit('ReponseChoisie', {leNom: question.innerText, idRepChoisie: i, Salon: room, idQuestion: idQuestionEnCours});
        alert("Réponse \""+label[i].innerText+"\" envoyée");
        document.getElementById("reponses").style = "display: none";
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
