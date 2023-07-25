import passport from "passport";
import GithubStrategy from "passport-github2";
import local from "passport-local";
import { createHash, validatePassword } from "../utils.js";
import UsersManager from "../DAOs/UsersManagerMongo.class.js";
const UsersManagers = new UsersManager();
const LocalStrategy = local.Strategy;

export const intializePassport = () => {
    passport.use(
        "github",
        new GithubStrategy(
            {
                clientID: "Iv1.10eab8999288a773",
                clientSecret: "ca928a9d138a6cf5d1adf980522bcec189d2d4cf",
                callbackURL:
                    "http://localhost:8080/api/sessions/githubcallback",
            },
            async (accessToken, refreshToken, profile, done) => {
                //console.log(profile);
                console.log("accessToken -->", accessToken);
                console.log("refreshToken -->", refreshToken);
                let user = await UsersManagers.getUser(profile._json.html_url);

                if (!user) {
                    let newUser = {
                        first_name: profile.username,
                        last_name: "test lastname",
                        email: profile.profileUrl,
                        age: 25,
                        password: "1234",
                    };
                    const newHashedPassword = createHash(newUser.password);
                    newUser.password = newHashedPassword;
                    const result = await UsersManagers.createUser(newUser);
                    done(null, result);
                } else {
                    console.log("usuario Existente");
                    const result = await UsersManagers.getUser(
                        profile.profileUrl
                    );
                    done(null, result);
                }
            }
        )
    );

    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: "email" },
            async (username, password, done) => {
                try {
                    const user = await UsersManagers.getUser(username);
                    if (!user) {
                        console.log("Usuario no encontrado");
                        return done(null, false);
                    }
                    if (!validatePassword(user, password)) {
                        console.log("Contraseña Incorrecta");
                        return done(null, false);
                    }
                    return done(null, user);
                } catch (error) {
                    return done("Error al obtener el usuario: " + error);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UsersManagers.getUserById(id);
        done(null, user);
    });
};
