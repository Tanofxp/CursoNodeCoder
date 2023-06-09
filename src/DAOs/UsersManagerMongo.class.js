import mongoose from "mongoose";
import userModel from "./models/Users.model.js";

export default class UsersManager {
    connection = mongoose.connect(
        "mongodb+srv://danifxp:OG7BXskD2H5e0Kk2@cluster0.n9h3lzv.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
    async getUser(email) {
        const user = await userModel.findOne({
            email: email,
        });
        return user;
    }
    async authUser(email, password) {
        const user = await userModel.findOne({
            email: email,
            password: password,
        });
        console.log(user);
        if (!user) return false;
        else return user;
    }
    async createUser(data) {
        const exist = await this.getUser(data.email);
        console.log(exist);
        if (exist) {
            return false;
        } else {
            data.rol = "usuario";

            console.log(data);
            const res = await userModel.create(data);
            return true, res;
        }
    }

    async updatePasswordUser(user, password) {
        await userModel.updateOne(
            { _id: user._id },
            { $set: { password: password } }
        );
        return true;
    }
}
