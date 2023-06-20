import mongoose from "mongoose";

const collection = "cart";

const CartsSchema = new mongoose.Schema({
    products: {
        type: Array,
        request: true,
    },
});

export const cartsModel = mongoose.model(collection, CartsSchema);
