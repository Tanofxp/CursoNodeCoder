import { Router } from "express";
const router = Router();
import socketServer, { ProductsManager } from "../App.js";

router.get("/", async (req, res) => {
    await ProductsManager.getProductsInStock().then((products) => {
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

export default router;
