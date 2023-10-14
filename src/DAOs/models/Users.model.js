import mongoose from "mongoose";

const collection = "users";

const schema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      required: true,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts",
    },
    documents: {
      type: [
        {
          name: {
            type: String,
          },
          reference: {
            type: String,
          },
        },
      ],
      default: [],
    },
    last_connection: {
      type: String,
      default: Date.now(),
    },
  },
  { versionKey: false }
);

const userModel = mongoose.model(collection, schema);
export default userModel;
