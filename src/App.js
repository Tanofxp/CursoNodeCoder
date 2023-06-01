import express from "express";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import { engine } from "express-handlebars";
import routerCart from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import routerProduct from "./routes/products.router.js";
import ProductManager from "./class/ProductManager.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public/"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use("/", viewsRouter);
app.use("/api/cart", routerCart);
app.use("/api/products/", routerProduct);

export const ProductsManager = new ProductManager();

const expressServer = app.listen(8080, () =>
    console.log("!Servidor arriba en el puerto 8080!")
);

const socketServer = new Server(expressServer);
const products = await ProductsManager.getProductsInStock();
socketServer.on("connection", (socket) => {
    socketServer.emit("initProduct", products);
    socket.on("message", (data) => {
        console.log(data);
    });
});

export default socketServer;
