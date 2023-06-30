import { Router } from "express";
const router = Router();
import socketServer, { ProductsManager, CartsManager } from "../App.js";

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
router.get("/cart", async (req, res) => {
    let cartId = "649e1af43c56abc4944c62df";
    await CartsManager.getCartById(cartId).then((product) => {
        let products = JSON.stringify(product.products);
        products = JSON.parse(products);
        res.render("cart", {
            title: "Carrito",
            products,
        });
    });
});

export default router;
