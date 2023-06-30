import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";

export default class ProductManager {
    connection = mongoose.connect(
        "mongodb+srv://danifxp:OG7BXskD2H5e0Kk2@cluster0.n9h3lzv.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );

    async addProduct(product) {
        try {
            let result = await productsModel.create(product);
            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async getProduct(
        limit = 10,
        page = 1,
        sort = 0,
        filtro = null,
        filtroVal = null
    ) {
        let whereOptions = {};
        console.log(filtro, filtroVal);
        if (filtro != "" && filtroVal != "") {
            whereOptions = { [filtro]: filtroVal };
        }
        console.log(limit, page, sort);
        let result = await productsModel.paginate(whereOptions, {
            limit: limit,
            page: page,
            sort: { price: sort },
        });
        console.log("esto es el limit", limit);
        return result;
    }

    async getProductById(id) {
        console.log("esto llega", id);
        let result = await productsModel.findOne({ _id: id });
        return result;
    }

    async updateProductById(id, updatedProduct) {
        let result = await productsModel.updateOne(
            { _id: id },
            { $set: updatedProduct }
        );
        return result;
    }

    async deleteProduct(id) {
        let result = await productsModel.deleteOne({ _id: id });
        return result;
    }
    async getProductsInStock() {
        const products = await productsModel.find();
        const inStock = [];

        inStock.push(...products.filter((product) => product.stock > 0));
        return inStock;
    }
}
