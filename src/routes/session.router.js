import { Router } from "express";
import UsersManager from "../DAOs/UsersManagerMongo.class.js";
import Mail from "../config/nodemailer.config.js";
import CurrentUserDTO from "../controllers/DTO/user.dto.js";
import config from "../config/config.js";
import passport from "passport";
import { createHash, validatePassword } from "../utils.js";
import jwt from "jsonwebtoken";

const UsersManagers = new UsersManager();
const router = Router();

router.post("/register", async (req, res) => {
  const data = req.body;
  const newHashedPassword = createHash(data.password);

  data.password = newHashedPassword;

  let response = await UsersManagers.createUser(data);
  if (response === false) {
    return res
      .status(400)
      .send({ status: "error", message: "El usuario ya existe" });
  } else {
    res.send({ status: "success", message: "usuario  registrado" });
  }
});

router.post("/requestRestartPassword", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete values" });
  }

  try {
    const user = await UsersManagers.getUser(email);

    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "There is no user with such email",
      });
    }

    // Este token va a durar 1 hora
    let token = jwt.sign({ email }, config.jwt_password_request, {
      expiresIn: "1h",
    });

    let mail = new Mail();

    await mail.send(
      user,
      "Password reset",
      `
            <div style='color: blue'>
                <h1> Restaura tu email haciendo click en el siguiente link </h1>
            </div>
            <a href="http://localhost:8080/resetPassword?token=${token}">Clik Aqui</a>
            `
    );

    return res.send({ status: "success", message: "Email sent" });
  } catch (error) {
    return res.status(404).send({ status: "error", error: error.message });
  }
});

router.post(
  "/login",
  passport.authenticate("login", {
    session: false,
    failureRedirect: "/faillogin",
  }),
  async (req, res) => {
    console.log(req.user);
    if (req.user === 1) {
      return res.status(400).send({
        status: "error",
        message: "Usuario no encontrado",
      });
    }
    if (req.user === 2) {
      return res.status(400).send({
        status: "error",
        message: "Contraseña Incorrecta",
      });
    }
    req.session.user = {
      name: req.user.first_name + " " + req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      rol: req.user.rol,
      cart: req.user.cart,
    };

    let token = jwt.sign(
      { email: req.user.email, first_name: req.user.first_name },
      "C4f3C0nL3ch3",
      {
        expiresIn: "24h",
      }
    );
    return res.cookie("tokenCookie", token, { httpOnly: true }).send({
      status: "success",
      payload: req.user,
    });
  }
);

router.get("/faillogin", (req, res) => {
  res.send({ error: "Failed to login" });
});

router.post("/restartPassword", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .send({ status: "error", message: "Complete los campos" });
  const user = await UsersManagers.getUser(email);

  if (!user)
    return res
      .status(400)
      .send({ status: "error", message: "Usuario no Encontrado" });
  const newHashedPassword = createHash(password);
  const pass = await UsersManagers.updatePasswordUser(user, newHashedPassword);
  console.log("esto es pass", pass);
  if (pass === true) {
    return res.status(200).send({
      status: "success",
      message: "Contraseña restaurada",
    });
  } else {
    return res.status(400).send({
      status: "error",
      message: "Problemas al cambiar la Contraseña intente denuevo mas tarde",
    });
  }
});

router.get(
  "/github",
  passport.authenticate("github", { scope: "user:email", session: false }),
  (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { session: false, failureRedirect: "/" }),
  async (req, res) => {
    try {
      console.log("exito");
      req.session.user = req.user;
      // console.log("Esto ---->>", req["session"]["user"]);
      const token = jwt.sign(
        { email: req.user.email, first_name: req.user.first_name },
        "C4f3C0nL3ch3",
        { expiresIn: "24h" }
      );
      res.cookie("tokenCookie", token, { httpOnly: true }).redirect("/home");
    } catch (error) {
      return next(error);
    }
  }
);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.session.user);
    res.send(new CurrentUserDTO(req.session.user));
  }
);

export default router;
