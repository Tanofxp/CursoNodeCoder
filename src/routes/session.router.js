import { Router } from "express";
import UsersManager from "../DAOs/UsersManagerMongo.class.js";
const UsersManagers = new UsersManager();
const router = Router();

router.post("/register", async (req, res) => {
    const data = req.body;
    let response = await UsersManagers.createUser(data);
    console.log("esto --->", response);
    return response;
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Esto le llega del post --->", email, password);

    const user = await UsersManagers.authUser(email, password);
    console.log("esto es User --->", user);
    if (user === false)
        return res.status(400).send("Usuario y Contraseña incorrecto");
    req.session.user = {
        name: user.first_name + user.last_name,
        email: user.email,
        age: user.age,
    };
    res.send({ status: "success", message: req.session.user });
});

export default router;
