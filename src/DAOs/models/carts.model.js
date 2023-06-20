import mongoose from "mongoose";

const collection = "cart";

const CartsSchema = new mongoose.Schema(
    {
        products: {
            type: Array,
            request: true,
        },
    },
    { versionKey: false }
);

export const cartsModel = mongoose.model(collection, CartsSchema);
