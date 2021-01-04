import { socket } from './socket.js';



var presentateur = "Le boss";
var eleve = ['eleve 1', 'eleve 2', 'eleve 3', 'eleve 4', 'eleve 5'];

socket.on("membres", (data) =>{
    console.log(data);
    presentateur = data.pres;
    eleve =  Object.keys(data.membres);
    try{

        let presDiv = document.getElementById("presentateur");
        let presBalise = document.createElement("p");
        presBalise.innerHTML = presentateur;
        presDiv.appendChild(presBalise);
    
    }
    catch(e){  
    }
    
    let lectDiv = document.getElementById("lecteur");
    
    
    eleve.forEach(function (item, index, array) {
        let lectBalise = document.createElement("p");
        lectBalise.innerHTML = item;
        lectDiv.appendChild(lectBalise);
    });
})
console.log(presentateur);
console.log(eleve);

socket.emit("getMembres", document.getElementById("room").innerHTML);
