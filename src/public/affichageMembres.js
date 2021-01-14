import { socket } from './socket.js';



var presentateur = "";
var eleve = [];

socket.on("membres", (data) =>{
    console.log(data);
    presentateur = data.pres;
    eleve =  Object.keys(data.membres);
    try{

        let presDiv = document.getElementById("presentateur");
        presDiv.innerHTML = "";
        let presBalise = document.createElement("p");
        presBalise.innerHTML = presentateur;
        presDiv.appendChild(presBalise);
    
    }
    catch(e){  
    }
    
    let lectDiv = document.getElementById("lecteur");
    lectDiv.innerHTML = "";

    eleve.forEach(function (item, index, array) {
        if(item == document.getElementById("username").innerHTML){
            let lectBalise = document.createElement("p");
            let uBalise = document.createElement("u");
            uBalise.innerHTML = item; 
            lectBalise.appendChild(uBalise);
            lectDiv.appendChild(lectBalise);
        }
        else{
            let lectBalise = document.createElement("p");
            lectBalise.innerHTML = item;
            lectDiv.appendChild(lectBalise);
        }
    });

    document.getElementById("nombreLecteurs").innerHTML = "(" + lectDiv.childElementCount  + ")";
})
console.log(presentateur);
console.log(eleve);

socket.emit("getMembres", document.getElementById("room").innerHTML);
