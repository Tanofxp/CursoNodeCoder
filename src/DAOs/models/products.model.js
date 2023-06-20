import mongoose from "mongoose";

const collection = "products";

const ProductsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        descripcion: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        code: {
            type: Number,
            required: true,
            unique: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
    },
    { versionKey: false }
);

export const productsModel = mongoose.model(collection, ProductsSchema);
