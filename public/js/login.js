const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    fetch("/api/sessions/login", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((result) => {
        console.log("esto es result del js----->", result.status);
        if (result.status === 200) {
            Swal.fire({
                position: "Center",
                icon: "success",
                title: "Bienvanido",
                text: "Inicio de sesión correco",
                showConfirmButton: false,
                timer: 1500,
            });
            window.location.replace("/home");
        } else {
            console.log("entre");
            Swal.fire({
                position: "Center",
                icon: "error",
                title: "Error al iniciar sesión",
                text: "Usuario y contraseña incorrectos",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
});
