import mongoose from "mongoose";
import { purchaseModel } from "./models/purchase.model.js";
import ProductManager from "./ProductManagerMongo.class.js";
import ManagerCarts from "./CartManagerMongo.class.js";
import config from "../config/config.js";

export default class PurchaseManager {
    connection = mongoose.connect(config.mongoUrl);
    productManager = new ProductManager();
    managerCarts = new ManagerCarts();
    async stockControl(cid) {
        const cart = await this.managerCarts.getCartById(cid);
        console.log("esto es el control de stock", cart);
    }

    async addPurchase(purchase) {
        try {
            let result = await purchaseModel.create(purchase);
            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}
