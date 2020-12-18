let affiche = false;

function createIFrame(room){
    if(!affiche){
        document.getElementById("iframe").style.display = "block";
        affiche = true;
    }
    else{
        document.getElementById("iframe").style.display = "none";
        affiche = false;
    }

    console.log(room);
}