import mongoose from "mongoose";
import { cartsModel } from "./models/carts.model.js";
export default class CartManager {
    connection = mongoose.connect(
        "mongodb+srv://danifxp:OG7BXskD2H5e0Kk2@cluster0.n9h3lzv.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
    async getCart() {
        let result = await cartsModel.find();
        console.log(result);
        return result;
    }

    async addCart() {
        let result = await cartsModel.create([]);
        console.log(result);
        return result;
    }

    async getCartById(id) {
        console.log(id);
        let result = await cartsModel.findOne({ _id: id });
        return result;
    }

    async addToCart(idCart, idProduct) {
        let cart = await this.getCartById(idCart);
        console.log(cart);
        // cid es el id del carrito, pid es el id del producto
    }
}
