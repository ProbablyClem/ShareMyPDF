function copyRoomLink(){    
    const el = document.createElement('textarea');
    el.value = window.location.host +"/room/"+document.getElementById("room").innerHTML;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    window.alert("URL de la page copiée dans le presse-papier");
}

document.getElementById("room").addEventListener("click", copyRoomLink);