import { Router } from "express";
import socketServer, { ProductsManager } from "../App.js";

const router = Router();

router.get("/", async (req, res) => {
    console.log(req.query.limit);
    const product = await ProductsManager.getProduct(req.query.limit);
    console.log(req.query.limit);
    res.send(product);
});

router.get("/:id", async (req, res) => {
    console.log(req.params.id);
    const product = await ProductsManager.getProductById(req.params.id);
    res.send(product);
});

router.post("/", async (req, res) => {
    console.log(req.body);
    const product = await ProductsManager.addProduct(req.body);
    socketServer.emit("newProduct", product);
    res.send(product);
});
router.put("/:id", async (req, res) => {
    console.log(req.body);
    const product = await ProductsManager.updateProductById(
        req.params.id,
        req.body
    );
    socketServer.emit("updateProduct", product);
    res.send(product);
});

router.delete("/:id", async (req, res) => {
    const product = await ProductsManager.deleteProduct(req.params.id);
    socketServer.emit("deleteProduct", req.params.id);
    res.send(product);
});

export default router;
