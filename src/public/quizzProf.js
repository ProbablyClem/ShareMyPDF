var nb_questions = 0;
var balise_questions = document.getElementById('questions');
var balise_choix = document.getElementById('choix');

class Question {
    constructor(nom = null, a = null, b = null, c = null, d = null, nbchoix = 2){
        this.nom = nom;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.nbChoix = nbchoix;
        nb_questions++;
    }

    addRep(){
        this.a = document.getElementById('rep_A').value;
        this.b = document.getElementById('rep_B').value;

        if(this.nbChoix == 2){
            this.nbChoix++;
            balise_choix.innerHTML += "<li id=\"C\"><input type=\"text\" id=\"rep_C\"> <button onclick=q_temp.delRep() id=\"del_C\">X</button> </li>"
            document.getElementById('rep_A').value = this.a;
            document.getElementById('rep_B').value = this.b;
        }
        else if(this.nbChoix == 3){
            this.c = document.getElementById('rep_C').value;
            this.nbChoix++;
            document.getElementById('del_C').style.display = "none";
            balise_choix.innerHTML += "<li id=\"D\"><input type=\"text\" id=\"rep_D\"> <button onclick=q_temp.delRep() id=\"del_D\">X</button> </li>";
            document.getElementById('rep_A').value = this.a;
            document.getElementById('rep_B').value = this.b;
            document.getElementById('rep_C').value = this.c;
            document.getElementById('add').style.display = "none";
        }
        else{
            throw "Seulement 4 propositions de réponses possibles";
        }
    }

    delRep(){
        console.log(this.nbChoix);
        if(this.nbChoix == 3){
            balise_choix.removeChild(document.getElementById('C'));
        }
        else if (this.nbChoix == 4){
            balise_choix.removeChild(document.getElementById('D'));
            document.getElementById('add').style.display = "block";
            document.getElementById('del_C').style.display = "inline";
        }
        this.nbChoix--;
    }
}

var allQuestions = [new Question("Pourquoi la vie est-elle à chier ?", "oui", "non")];
var q_temp = new Question();

function ajouterReponse(){
    q_temp.addRep();
}

function afficherQuestion(q, index){
    balise_questions.innerHTML += "<li id=\"Q"+index+"\"> Question " + index + " : " + q.nom 
            + " <button onclick=questLaunch() title=\"Lancer question\">"
            +   "→"
            + "</button>"
            + "<button onclick=checkResults() title=\"Voir résultats\">"
            +   "&#128269"
            + "</button>"
            + "<button onclick=delQuest("+index+") title=\"Supprimer question\">"
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
    var question_possible = true;
    q_temp.nom = document.getElementById('nom_question').value;
    if(!q_temp.nom){
        alert("Veuillez remplir le champs nom !");
        return; // Pour stopper le code
    }

    q_temp.a = document.getElementById('rep_A').value;
    q_temp.b = document.getElementById('rep_B').value;

    switch(q_temp.nbChoix){
        case 2: 
            if(q_temp.a == "" || q_temp.b == ""){
                question_possible = false;
            }
            break;

        case 3:
            q_temp.c = document.getElementById('rep_C').value;
            if(q_temp.c == ""){
                question_possible = false;
            }
            break;

        case 4:
            q_temp.c = document.getElementById('rep_C').value;
            q_temp.d = document.getElementById('rep_D').value;
            if(q_temp.c == "" || q_temp.d == ""){
                question_possible = false;
            }
            break;
    }

    console.log(q_temp);

    if(question_possible){
        allQuestions.push(q_temp);
    }
    else{
        alert("Un champ n'a pas été rempli !");
        return;
    }
    console.log(allQuestions);
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