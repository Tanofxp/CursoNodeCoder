import { Router } from "express";
const router = Router();
import socketServer, { ProductsManager, CartsManager } from "../App.js";

router.get("/", async (req, res) => {
    let limit = Number(req.query.limit);
    let page = Number(req.query.page);
    let sort = Number(req.query.sort);
    let filtro = req.query.filtro;
    let filtroVal = req.query.filtroVal;
    console.log(req.query);
    if (!limit) {
        limit = 9;
    }
    if (!page) {
        page = 1;
    }
    await ProductsManager.getProduct(limit, page, sort, filtro, filtroVal).then(
        (product) => {
            let products = JSON.stringify(product.docs);
            products = JSON.parse(products);
            product.prevLink = product.hasPrevPage
                ? `http://localhost:8080/?page=${product.prevPage}`
                : "";
            product.nextLink = product.hasNextPage
                ? `http://localhost:8080/?page=${product.nextPage}`
                : "";
            product.isValid = !(page <= 0 || page > product.totalPages);
            console.log(product);

            res.render("home", {
                title: "Productos",
                product,
            });
        }
    );
});

router.get("/realtimeproducts", async (req, res) => {
    await ProductsManager.getProduct().then(() => {
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
