import { socket } from "./socket.js"

let room = document.getElementById("room").innerHTML;

var balise_questions = document.getElementById('questionsQuizz');
var balise_choix = document.getElementById('choix');

var bouton_add = document.getElementById("add");
var bouton_creer = document.getElementById("creer");

const MAX_PROP = 4;
const MIN_PROP = 2;

class ItemsDeReponse{
    constructor(intitule = "", compteur = 0){
        this.intitule = intitule;
        this.compteur = compteur;
    }

    addCompteur(){
        this.compteur++;
    }
}

class Quest_Quizz {
    constructor(nom = "", props = [new ItemsDeReponse(), new ItemsDeReponse()], rep_vraie = 0){
        this.nom = nom;
        this.props = props;
        this.rep_vraie = rep_vraie;
    }

    getProps(){
        return this.props;
    }

    addRep(){
        if(this.props.length < MAX_PROP){
            this.props.push(new ItemsDeReponse());
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
            input.value = choix.intitule;
            input.addEventListener("change", () => {this.props[index].intitule = input.value});
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

    getAllResults(){
        var allResults = [];
        this.props.forEach(element => {
            allResults.push(element.compteur);
        });
        return allResults;
    }

    getAllPropsName(){
        var allName = [];
        this.props.forEach(element => {
            allName.push(element.intitule);
        });
        return allName;
    }
}

var allQuestions = [new Quest_Quizz("La question s'affiche-t-elle ?", [new ItemsDeReponse("oui"), new ItemsDeReponse("non")]), 
                                            new Quest_Quizz("Et celle-ci ?", [new ItemsDeReponse("oui"), new ItemsDeReponse("non")])];

function getAllQuestions(){
    return allQuestions;
}

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
    bouton1.onclick = () => launchQuestion(index);
    bouton1.innerText = "→";
    liste.appendChild(texte);
    liste.appendChild(bouton1);
    
    var bouton2 = document.createElement("button");
    bouton2.title = "Voir résultats";
    bouton2.onclick = () => voirResultat(index);
    bouton2.innerText = String.fromCodePoint(0x1F50D);
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

function launchQuestion(i){
    console.log(socket.id);
    var id = i-1;
    var toutes_ques = getAllQuestions();
    socket.emit('QuestionItems', {objectQuestion: toutes_ques[id], Salon: room, idQuestion: id});
    console.log("Question "+i+" lancée");
}

function voirResultat(i){
    var id = i-1;
    var toutes_ques = getAllQuestions();
    var nom_question = toutes_ques[id].nom;
    var res = document.getElementById('resultats');
    res.style = "display: block;";
    var quitter = document.createElement('button');
    quitter.innerText = "Fermer";
    quitter.onclick = () => res.style = "display: none;";
    if(res.childElementCount > 1){
        res.removeChild(res.lastChild);
    }
    var chartData = {
        type: 'bar',
        title: {
            text: nom_question
        },
        series: [
        { values: toutes_ques[id].getAllResults() }
        ],
        "scale-x": {
            values: toutes_ques[id].getAllPropsName()
        }
    };
    zingchart.render({
        id: 'resultats',
        data: chartData,
        height: 400,
        width: 600
    });

    if(res.childElementCount < 2){
        res.appendChild(quitter);
    }
}

socket.on('ReponseChoisie', (data) =>{
    allQuestions[data.idQuestion].props[data.idRepChoisie].addCompteur();
    console.log(allQuestions[data.idQuestion]);
});

bouton_add.addEventListener("click",ajouterReponse);
bouton_creer.addEventListener("click", creerQuestion);

window.addEventListener("load",displayQuestions);