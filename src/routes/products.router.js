import { Router } from "express";
import socketServer, { ProductsManager } from "../App.js";
import { rolesMiddlewareAdmin } from "../middleware/role.middleware.js";
import passport from "passport";
import jwt from "jsonwebtoken";
const router = Router();

router.get("/", async (req, res) => {
    let limit = Number(req.query.limit);
    let page = Number(req.query.page);
    let sort = Number(req.query.sort);
    let filtro = req.query.filtro;
    let filtroVal = req.query.filtroVal;
    if (!limit) {
        limit = 9;
    }

    const product = await ProductsManager.getProduct(
        limit,
        page,
        sort,
        filtro,
        filtroVal
    );

    res.send({ status: "success", product });
});

router.get("/:id", async (req, res) => {
    const product = await ProductsManager.getProductById(req.params.id);
    res.send(product);
});

router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    rolesMiddlewareAdmin,
    async (req, res, next) => {
        if (req.session.user.role == "admin") {
            try {
                const product = await ProductsManager.addProduct(req.body);
                socketServer.emit("newProduct", product);
                res.send(product);
            } catch (error) {
                return next(error);
            }
        }
    }
);
router.put("/:id", async (req, res) => {
    if (req.session.user.role == "admin") {
        const product = await ProductsManager.updateProductById(
            req.params.id,
            req.body
        );
        if (product.matchedCount > 0) {
            const newProduct = await ProductsManager.getProductById(
                req.params.id
            );
            socketServer.emit("updateProduct", newProduct);
        }
        res.send(product);
    } else {
        res.send({ error: "acceso denegado" });
    }
});

router.delete(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    rolesMiddlewareAdmin,
    async (req, res) => {
        if (req.session.user.role == "admin") {
            const product = await ProductsManager.deleteProduct(req.params.id);
            socketServer.emit("deleteProduct", req.params.id);
            res.send(product);
        } else {
            res.send({ error: "acceso denegado" });
        }
    }
);

export default router;
