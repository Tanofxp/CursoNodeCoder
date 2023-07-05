import { Router } from "express";
import UsersManager from "../DAOs/UsersManagerMongo.class.js";
const UsersManagers = new UsersManager();
const router = Router();

router.post("/register", async (req, res) => {
    const data = req.body;
    let response = await UsersManagers.createUser(data);
    if (response === false) {
        return res
            .status(400)
            .send({ status: "error", message: "El usuario ya existe" });
    } else {
        res.send({ status: "success", message: "usuario  registrado" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await UsersManagers.authUser(email, password);
    if (user === false)
        return res.status(400).send("Usuario y Contraseña incorrecto");
    req.session.user = {
        name: user.first_name + user.last_name,
        email: user.email,
        age: user.age,
    };
    res.send({ status: "success", message: req.session.user });
});

router.delete("/logout", (req, res) => {
    console.log("entre al logout");
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                res.status(400).send("Unable to log out");
            } else {
                res.send("Logout successful");
            }
        });
    } else {
        res.end();
    }
});

export default router;
