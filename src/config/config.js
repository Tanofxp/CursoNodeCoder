import dotenv from "dotenv";

dotenv.config();

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    mongoSecret: process.env.MONGO_SECRET,
    passportSK: process.env.PASSPORT_SECRET_KEY,
    gitClientId: process.env.PASSPORT_GIT_CLIENT_ID,
    gitClientsecret: process.env.PASSPORT_GIT_CLIENT_SECRET,
    githubCallbackPath: process.env.PASSPORT_CALLBACK_URL,
    ENVIRONMENT: process.env.ENVIRONMENT,
    nodemailUser: process.env.NODEMAIL_USER,
    nodemailPass: process.env.NODEMAIL_PASS,
};
