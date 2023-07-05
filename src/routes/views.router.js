import { Router } from "express";
const router = Router();
import socketServer, { ProductsManager, CartsManager } from "../App.js";

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/", (req, res) => {
    res.render("login");
});
router.get("/profile", (req, res) => {
    console.log(req.session);
    res.render("profile", {
        user: req.session.user,
    });
});
router.get("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                res.status(400).send("Unable to log out");
            } else {
                res.redirect("/");
            }
        });
    } else {
        res.redirect("/");
    }
});
router.get("/home", async (req, res) => {
    let limit = Number(req.query.limit);
    let page = Number(req.query.page);
    let sort = Number(req.query.sort);
    let filtro = req.query.filtro;
    let filtroVal = req.query.filtroVal;

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
                ? `http://localhost:8080/home/?page=${product.prevPage}`
                : "";
            product.nextLink = product.hasNextPage
                ? `http://localhost:8080/home/?page=${product.nextPage}`
                : "";
            product.isValid = !(page <= 0 || page > product.totalPages);

            res.render("home", {
                title: "Productos",
                user: req.session.user,
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
    let cartId = "64a5b2ce13eef43be345ac05";
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
