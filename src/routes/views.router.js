import { Router } from "express";
const router = Router();
import socketServer, { ProductsManager } from "../App.js";

router.get("/", async (req, res) => {
    await ProductsManager.getProductsInStock().then((product) => {
        let products = JSON.stringify(product);
        products = JSON.parse(products);
        console.log(products);
        res.render("home", {
            title: "Productos",
            products,
        });
    });
});

router.get("/realtimeproducts", async (req, res) => {
    await ProductsManager.getProductsInStock().then(() => {
        res.render("realTimeProducts", {
            title: "Productos",
        });
    });
});

router.get("/chat", (req, res) => {
    res.render("chat");
});

export default router;
