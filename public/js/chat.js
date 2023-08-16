const socket = io();
let user;

const chatbox = document.getElementById("chatbox");
const messageLogs = document.getElementById("messageLogs");
const button = document.getElementById("enviar");

axios
    .get("/api/sessions/current")
    .then((res) => {
        console.log(res.data.name);
        user = res.data.name;
        socket.emit("authenticatedUser", user);
        document.getElementById("user").innerText = user;
    })
    .catch((err) => {
        console.error(err);
    });

chatbox.addEventListener("keyup", (evt) => {
    if (evt.key === "Enter") {
        enviar();
    }
});

button.onclick = () => {
    enviar();
};

function enviar() {
    socket.emit("message", { user: user, message: chatbox.value });
    chatbox.value = "";
}

socket.on("imprimir", (data) => {
    let mensajes = "";
    data.forEach((msj) => {
        mensajes += `${msj.user}:  ${msj.message}<br/>`;
    });
    messageLogs.innerHTML = mensajes;
});

socket.on("newUserAlert", (data) => {
    if (!user) return;
    Swal.fire({
        toast: true,
        position: "center",
        showConfirmButton: false,
        timer: 5000,
        title: data + " se ha unido al chat",
        icon: "success",
    });
});
