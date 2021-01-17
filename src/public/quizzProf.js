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

    resetCompteur(){
        this.compteur = 0;
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
            document.getElementById("add").style.display = "inline";
        }
    }

    display(){
        var intitule = document.getElementById('nom_question');
        intitule.value = this.nom;
        intitule.addEventListener("change", () => {this.nom = intitule.value});
        
        balise_choix.innerHTML = "";
        this.props.forEach((choix, index) => {
            var proposition = document.createElement("div");
            proposition.classList.add('input-group', 'my-1');
            var input = document.createElement("input");
            input.classList.add('form-control');
            input.id = "rep_"+(index+1);
            input.type = "text";
            input.value = choix.intitule;
            input.addEventListener("change", () => {this.props[index].intitule = input.value});

            var indexField = document.createElement('span');
            indexField.style.fontFamily = 'monospace';
            switch (index + 1) {
                case 1:
                    indexField.innerText = 'A';
                    break;
                case 2:
                    indexField.innerText = 'B';
                    break;
                case 3:
                    indexField.innerText = 'C';
                    break;
                case 4:
                    indexField.innerText = 'D';
                    break;
                default:
                    
            }
            indexField.classList.add('input-group-text');
            proposition.appendChild(indexField);

            proposition.appendChild(input);
            balise_choix.appendChild(proposition);
            if(index === this.props.length-1 && this.props.length > MIN_PROP){
                var annuler = document.createElement("button");
                annuler.classList.add('btn', 'btn-danger');
                annuler.innerHTML = "✕";
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
            if(choix.intitule == ""){
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

var allQuestions = [];

function getAllQuestions(){
    return allQuestions;
}

var q_temp = new Quest_Quizz();
q_temp.display();

function ajouterReponse(){
    q_temp.addRep();
}

function afficherQuestion(q, index){
    var liste = document.createElement("div");
    liste.classList.add('input-group', 'my-2');
    liste.id = "Q"+index;

    var texte = document.createElement("span");
    texte.classList.add('input-group-text', 'form-control');
    texte.innerText = q.nom;
    
    var bouton1 = document.createElement("button");
    bouton1.classList.add('btn', 'btn-success');
    bouton1.title = "Lancer question";
    bouton1.onclick = () => launchQuestion(index);
    bouton1.innerText = "➤";
    liste.appendChild(texte);
    liste.appendChild(bouton1);
    
    var bouton2 = document.createElement("button");
    bouton2.classList.add('btn', 'btn-dark');
    bouton2.title = "Voir résultats";
    bouton2.onclick = () => voirResultat(index);
    //bouton2.innerText = String.fromCodePoint(0x1F50D);
    bouton2.innerText = "%";
    liste.appendChild(bouton2);

    var bouton3 = document.createElement("button");
    bouton3.classList.add('btn', 'btn-danger');
    bouton3.title = "Supprimer question";
    bouton3.onclick = () => delQuest(index);
    bouton3.innerText = "✕";
    liste.appendChild(bouton3);

    balise_questions.appendChild(liste);
}

function delQuest(i){
    var toutes_ques = getAllQuestions();
    toutes_ques[i-1].getProps().forEach(choix => {
        choix.resetCompteur();
    });
    allQuestions.splice(i-1, 1);
    console.log(allQuestions);
    displayQuestions();
}

function creerQuestion(){
    if(q_temp.isValid()){
        allQuestions.push(new Quest_Quizz(q_temp.nom, q_temp.props.map(reponse => new ItemsDeReponse(reponse.intitule, reponse.compteur)), q_temp.rep_vraie));
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
    var resDiv = document.getElementById('resDiv');
    resDiv.style.display = 'block';
    var id = i-1;
    var toutes_ques = getAllQuestions();
    var nom_question = toutes_ques[id].nom;
    var res = document.getElementById('resultats');
    res.style = "display: block;";
    var quitter = document.createElement('button');
    quitter.innerText = "Fermer";
    quitter.classList.add('btn', 'btn-danger');
    quitter.onclick = () => resDiv.style = "display: none;";
    var nb_total_votes = 0;
    toutes_ques[id].getAllResults().forEach(rep => {
        nb_total_votes += rep;
    });
    if(res.childElementCount > 1){
        res.removeChild(res.lastChild);
    }
    var chartData = {
        type: 'bar',
        title: {
            text: nom_question+" (Nombre de votes : "+nb_total_votes+")"
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
document.getElementById("add").addEventListener("click", ajouterReponse);
document.getElementById("creer").addEventListener("click", creerQuestion);

window.addEventListener("load",displayQuestions);