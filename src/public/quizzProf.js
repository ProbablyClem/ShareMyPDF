var balise_questions = document.getElementById('questions');
var balise_choix = document.getElementById('choix');
const MAX_PROP = 4;
const MIN_PROP = 2;

class Quest_Quizz {
    constructor(nom = "", props = ["", ""], rep_vraie = 0){
        this.nom = nom;
        this.props = props;
        this.rep_vraie = rep_vraie;
    }

    addRep(){
        if(this.props.length < MAX_PROP){
            this.props.push("");
            this.display();
        }
        if(this.props.length >= MAX_PROP){
            document.getElementById("add").style.display = "none";
        }
    }

    delRep(){
        if(this.props.length > MIN_PROP){
            this.props.pop();
            this.display();
        }
        if(this.props.length < MAX_PROP){
            document.getElementById("add").style.display = "block";
        }
    }

    display(){
        var intitule = document.getElementById('nom_question');
        intitule.value = this.nom;
        intitule.addEventListener("change", () => {this.nom = intitule.value});
        
        balise_choix.innerHTML = "";
        this.props.forEach((choix, index) => {
            var proposition = document.createElement("li");
            var input = document.createElement("input");
            input.id = "rep_"+(index+1);
            input.type = "text";
            input.value = choix;
            input.addEventListener("change", () => {this.props[index] = input.value});
            proposition.appendChild(input);
            balise_choix.appendChild(proposition);
            if(index === this.props.length-1 && this.props.length > MIN_PROP){
                var annuler = document.createElement("button");
                annuler.innerText = "X";
                annuler.onclick = () => {q_temp.delRep()};
                proposition.appendChild(annuler);
            }
            console.log(this);
        });
    }

    isValid(){
        var possible = true;
        if(this.nom == ""){
            possible = false;
        }

        this.props.forEach(choix => {
            if(choix == ""){
                possible = false;
            }
        });

        return possible;
    }

    copy(){
        var q = new Quest_Quizz(this.nom, [...this.props]);
        return q;
    }
}

var allQuestions = [new Quest_Quizz("Pourquoi la vie est-elle à chier ?", ["oui", "non"])];
var q_temp = new Quest_Quizz();
q_temp.display();

function ajouterReponse(){
    q_temp.addRep();
}

function afficherQuestion(q, index){
    var liste = document.createElement("li");
    liste.id = "Q"+index;

    var texte = document.createElement("span");
    texte.innerText = "Question " + index + " : " + q.nom;
    
    var bouton1 = document.createElement("button");
    bouton1.title = "Lancer question";
    bouton1.onclick = () => console.log("lancer marche");
    bouton1.innerText = "→";
    liste.appendChild(texte);
    liste.appendChild(bouton1);
    
    var bouton2 = document.createElement("button");
    bouton2.title = "Voir résultats";
    bouton2.onclick = () => console.log("voir marche");
    bouton2.innerText = "&#128269";
    liste.appendChild(bouton2);

    var bouton3 = document.createElement("button");
    bouton3.title = "Supprimer question";
    bouton3.onclick = () => delQuest(index);
    bouton3.innerText = "X";
    liste.appendChild(bouton3);

    balise_questions.appendChild(liste);
}

function delQuest(i){
    allQuestions.splice(i-1, 1);
    console.log(allQuestions);
    displayQuestions();
}

function test(){
    console.log("ça marche");
}

function creerQuestion(){
    if(q_temp.isValid()){
        allQuestions.push(q_temp.copy());
        displayQuestions();
    }
    else{
        alert("Veuillez remplir tous les champs");
    }
    console.log(allQuestions);
}

function displayQuestions(){
    balise_questions.innerHTML = "";
    var index = 0;
    allQuestions.forEach(quest => {
        index++;
        afficherQuestion(quest, index)
    });
}

window.addEventListener("load",displayQuestions);