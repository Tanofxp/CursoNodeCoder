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
    const product = await ProductsManager.getProductById(
        parseInt(req.params.id)
    );

    res.send(product);
});

router.post("/", async (req, res) => {
    console.log(req.body);
    const product = await ProductsManager.addProduct(req.body);
    socketServer.emit("newProduct", newProduct);
    res.send(product);
});
router.put("/:id", async (req, res) => {
    console.log(req.body);
    const product = await ProductsManager.updateProductById(
        parseInt(req.params.id),
        req.body
    );
    socketServer.emit("updateProduct", product);
    res.send(product);
});

router.delete("/:id", async (req, res) => {
    const product = await ProductsManager.deleteProduct(
        parseInt(req.params.id)
    );
    socketServer.emit("deleteProduct", id);
    res.send(product);
});

export default router;
