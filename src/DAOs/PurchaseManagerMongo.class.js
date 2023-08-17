import mongoose from "mongoose";
import { purchaseModel } from "./models/purchase.model.js";
import ProductManager from "./ProductManagerMongo.class.js";
import ManagerCarts from "./CartManagerMongo.class.js";
import config from "../config/config.js";
import { v4 as uuidV4 } from "uuid";

export default class PurchaseManager {
    connection = mongoose.connect(config.mongoUrl);
    productManager = new ProductManager();
    managerCarts = new ManagerCarts();
    async stockControl(cid) {
        const cart = await this.managerCarts.getCartById(cid);
        if (cart.products.length > 0) {
            console.log(cart.products);
            cart.products.forEach((e) => {
                console.log(e.product.stock);
            });
            let a = "esto tiene algo";
            return a;
        } else {
            let a = "esto no tiene nada gato";
            return a;
        }
    }

    async addPurchase(id) {
        try {
            let resStok = await this.stockControl(id.cart);
            console.log(resStok);
            let purchase = new Object();
            let date = new Date();

            purchase.purchase_datetime = date;
            purchase.code = uuidV4();
            purchase.amount = 500;
            purchase.purchaser = id.email;

            //let result = await purchaseModel.create(purchase);
            //console.log(result);
            //return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}
