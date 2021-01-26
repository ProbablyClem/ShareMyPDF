import { socket } from './socket.js';



var presentateur = "";
var eleve = [];
let username = document.getElementById("username").innerHTML;
let salon = document.getElementById("room").innerHTML;
socket.on("membres", (data) =>{
    console.log(data);
    presentateur = data.pres;
    eleve =  Object.keys(data.membres);
    try{

        let presDiv = document.getElementById("presentateur");
        presDiv.innerHTML = presentateur;
    
    }
    catch(e){  
    }
    
    let lectList = document.getElementById("lecteurs");
    lectList.innerHTML = "";

    eleve.forEach(function (item, index, array) {
        let lectBalise = document.createElement("li");
        lectBalise.classList.add('list-group-item', 'h3', 'm-0');
        
        lectBalise.innerHTML = item;
        if(username == presentateur){
            var closeBtn = document.createElement('button');
                closeBtn.classList.add('btn-close');
                closeBtn.addEventListener("click", ()=>{
                    if (window.confirm("Voulez vous vraiment banir " + item + " de ce Salon ?")) {
                        socket.emit("ban", {room: salon, membre: item});
                    }
                })
                lectBalise.appendChild(closeBtn);
        }else{
            if(item == username){
                lectBalise.classList.add('disabled');
            }
        }
        
        lectList.appendChild(lectBalise);
    });

    document.getElementById("nombreLecteurs").innerHTML = "(" + lectList.childElementCount  + ")";
})
console.log(presentateur);
console.log(eleve);

socket.emit("getMembres", document.getElementById("room").innerHTML);
