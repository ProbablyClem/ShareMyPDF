var nb_questions = 0;
var balise_questions = document.getElementById('questions');

class Question {
    constructor(nom, a, b){
        this.nom = nom;
        this.a = a;
        this.b = b;
        this.c = null;
        this.d = null;
        this.nbChoix = 2;
        nb_questions++;
    }

    addRep(choix){
        if(this.nbChoix == 2){
            this.c = choix;
            this.nbChoix++;
        }
        else if(this.nbChoix == 3){
            this.d = choix;
            this.nbChoix++;
        }
        else{
            throw "Seulement 4 propositions de réponses possibles";
        }
    }
}

var allQuestions = [new Question("Pourquoi la vie est-elle à chier ?", "oui", "non")];

function afficherQuestion(q, index){
    balise_questions.innerHTML += "<li id=\"Q"+index+"\"> Question " + index + " : " + q.nom 
            + " <button onclick=questLaunch()>"
            +   "→"
            + "</button>"
            + "<button onclick=checkResults()>"
            +   "&#128269"
            + "</button>"
            + "<button onclick=delQuest("+index+")>"
            +   "X"
            +"</button>"
            + "</li>";
}

function delQuest(i){
    document.getElementById("questions").removeChild(document.getElementById("Q"+i));
    allQuestions.splice(i-1, 1);
    nb_questions--;
    console.log(allQuestions);
}

function creerQuestion(){
    nom = document.getElementById('nom_question').value;
    a = document.getElementById('rep_A').value;
    b = document.getElementById('rep_B').value;
    allQuestions.push(new Question(nom, a, b));
}

function demarrage(){
    balise_questions.innerHTML = "";
    var index = 0;
    allQuestions.forEach(quest => {
        index++;
        afficherQuestion(quest, index)
    });
}

window.addEventListener("load",demarrage);
document.getElementById('creer').addEventListener("click", demarrage);