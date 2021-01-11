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

function openPopupResult(prop1, prop2, prop3, prop4){
    
}

function popitup(url) {
    newwindow=window.open(url,'name','height=300,width=650,top=75,left=860');
    if (window.focus) {
        newwindow.focus();
    }
    return false;
}