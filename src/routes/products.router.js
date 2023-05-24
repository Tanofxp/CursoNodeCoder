import { Router } from "express";
import ProductManager from "../class/ProductManager.js";

const router = Router();
const ProductsManager = new ProductManager();

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

    res.send(product);
});
router.put("/:id", async (req, res) => {
    console.log(req.body);
    const product = await ProductsManager.updateProductById(
        parseInt(req.params.id),
        req.body
    );

    res.send(product);
});

export default router;
