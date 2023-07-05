import mongoose from "mongoose";
import { userModel } from "./models/Users.model.js";

export default class UsersManager {
    connection = mongoose.connect(
        "mongodb+srv://danifxp:OG7BXskD2H5e0Kk2@cluster0.n9h3lzv.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
    async getUser(email) {
        console.log(email);
    }
    async authUser(email, password) {
        console.log(email, password);
        const user = await userModel.findOne({
            email: email,
            password: password,
        });
        console.log(user);
        if (!user) return false;
        else return true;
    }
    async createUser(data) {
        const exist = await this.getUser(data.email);
        if (exist) {
            return res
                .status(400)
                .send({ status: "error", message: "El usuario ya existe" });
        }
        console.log(data);
        await userModel.create(data);
        res.send({ status: "success", message: "usuario  registrado" });
    }
}
