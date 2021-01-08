function getSocket(room, pseudo) {
    console.log('Chargement du socket :', room, pseudo);
    var skt = io.connect("http://localhost:3000");
    skt.emit("login", { room: room, pseudo: pseudo});
    return skt;
}

export var socket = getSocket(document.getElementById("room").innerHTML, document.getElementById("username").innerHTML);