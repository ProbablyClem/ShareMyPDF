function copyRoomLink(){    
    const el = document.createElement('textarea');
    el.value = window.location.origin +"/room/"+document.getElementById("room").innerHTML;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    window.alert("URL de la page copiée dans le presse-papier");
}

function copyRoomCode(){    
    const el = document.createElement('textarea');
    el.value = document.getElementById("room").innerHTML;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    window.alert("Code du salon copié dans le presse-papier");
}

document.getElementById("invite").addEventListener("click", copyRoomLink);
document.getElementById("copyRoomCode").addEventListener("click", copyRoomCode);