import express from "express";
import session from "express-session";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import { engine } from "express-handlebars";
import routerCart from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import MongoStore from "connect-mongo";
import routerProduct from "./routes/products.router.js";
import ProductManager from "./DAOs/ProductManagerMongo.class.js";
import CartManager from "./DAOs/CartManagerMongo.class.js";
import { messagesModel } from "./DAOs/models/messages.model.js";
import sessionRouter from "./routes/session.router.js";
import mockingproducts from "./routes/mocking.router.js";
import { intializePassport } from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import routerLogger from "./routes/logger.router.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { addLogger } from "./config/logger.config.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const app = express();
app.use(addLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public/"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
intializePassport();
app.use(
    session({
        store: new MongoStore({
            mongoUrl: config.mongoUrl,
        }),
        secret: config.mongoSecret,
        resave: true,
        saveUninitialized: false,
    })
);

app.use(cookieParser());
app.use(passport.initialize());

app.use("/", viewsRouter);
app.use("/api/cart", routerCart);
app.use("/api/products/", routerProduct);
app.use("/api/sessions", sessionRouter);
app.use("/api/mockingproducts", mockingproducts);
app.use("/logger/", routerLogger);
app.use(errorMiddleware);

export const ProductsManager = new ProductManager();
export const CartsManager = new CartManager();

const expressServer = app.listen(config.port, () =>
    console.log(`!Servidor arriba en el puerto ${config.port}!`)
);

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "documentacion clase 39",
            description:
                "esta es la documentacion de la clase 39, proyecto curso_node_coder",
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);

app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

const socketServer = new Server(expressServer);

const products = await ProductsManager.getProductsInStock();

const mensajes = [];

socketServer.on("connection", (socket) => {
    socketServer.emit("initProduct", products);
    socket.on("message", (data) => {
        console.log(data);
    });

    socket.on("message", (data) => {
        console.log("esto son los mensajes", data);
        mensajes.push(data);
        socketServer.emit("imprimir", mensajes);
        messagesModel.create(data);
    });

    socket.on("authenticatedUser", (data) => {
        socket.broadcast.emit("newUserAlert", data);
    });
});

export default socketServer;
