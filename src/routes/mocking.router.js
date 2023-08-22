import { Router } from "express";
import socketServer, { ProductsManager } from "../App.js";

const router = Router();

router.get("/", async (req, res) => {
    const product = await ProductsManager.getMockingProducts();
    res.send(product);
});

export default router;
