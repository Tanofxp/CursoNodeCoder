import mongoose from "mongoose";
import { cartsModel } from "./models/carts.model.js";
import ProductManager from "./ProductManagerMongo.class.js";

export default class CartManager {
    connection = mongoose.connect(
        "mongodb+srv://danifxp:OG7BXskD2H5e0Kk2@cluster0.n9h3lzv.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
    productManager = new ProductManager();
    async getCart() {
        let result = await cartsModel.find();
        console.log(result);
        return result;
    }

    async addCart() {
        let cart = {
            product: [],
        };
        console.log(cart);
        let result = await cartsModel.create(cart);
        console.log(result);
        return result;
    }

    async getCartById(id) {
        let result = await cartsModel.findOne({ _id: id });
        return result;
    }

    async addToCart(idCart, idProduct, q) {
        let product = await this.productManager.getProductById(idProduct);
        let cart = await this.getCartById(idCart);
        cart.products.push({ product: product, quantity: q });

        await cart.save();

        return;
    }

    async deleteProductFromCart(idCart, idProduct) {
        const cart = await this.getCartById(idCart);
        cart.products.pull(idProduct);
        await cart.save();
        return;
    }

    async deleteAllProductsFromCart(idCart) {
        const cart = await this.getCartById(idCart);
        cart.products = [];
        await cart.save();
        return;
    }

    async updateCartQuantity(idCart, idProduct, q) {
        let cart = await this.getCartById(idCart);
        let productos = cart.products;
        let este = productos.find(
            (prod) => prod.product.valueOf() === idProduct
        );
        este.quantity = q;

        await cart.save();
        return;
    }
    async updateCartProducts(idCart, data) {
        let list = [];
        await this.deleteAllProductsFromCart(idCart);
        let cart = await this.getCartById(idCart);
        data.forEach((e) => {
            cart.push(e);
        });
        //list.push(data.productos.json());
        //console.log(list);
        console.log(typeof a);
        console.log(data);
        //await cart.save();

        return;
    }
}
