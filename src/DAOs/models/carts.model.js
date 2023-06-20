import mongoose from "mongoose";

const collection = "cart";

const ProductsSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    quantity: { type: Number, required: true },
});

const CartsSchema = new mongoose.Schema({
    products: [ProductsSchema],
});

export const cartsModel = mongoose.model(collection, CartsSchema);
