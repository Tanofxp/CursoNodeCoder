import mongoose from "mongoose";
import userModel from "./models/Users.model.js";
import ManagerCarts from "../DAOs/CartManagerMongo.class.js";
import config from "../config/config.js";
const managerCarts = new ManagerCarts();

export default class UsersManager {
  connection = mongoose.connect(config.mongoUrl);
  async getUser(email) {
    const user = await userModel.findOne({
      email: email,
    });
    return user;
  }
  async getUserById(id) {
    const user = await userModel.findById(id);
    return user;
  }
  async authUser(email, password) {
    const user = await userModel.findOne({
      email: email,
      password: password,
    });
    if (!user) return false;
    else return user;
  }
  async createUser(data) {
    const exist = await this.getUser(data.email);
    console.log(exist);
    if (exist) {
      return false;
    } else {
      const cartId = await managerCarts.addCart();
      data.rol = "usuario";
      data.cart = cartId._id.valueOf();
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

  async updateUserRole(id, newRole) {
    let user = await userModel.findOne({ _id: id });

    if (!user) {
      throw new Error("User wasn't found");
    }

    await userModel.updateOne({ _id: user._id }, { $set: { role: newRole } });
  }

  async updateUserLastConnection(id, lastConnection) {
    await userModel.updateOne(
      { _id: id },
      { $set: { last_connection: lastConnection } }
    );
  }

  async updateUserDocuments(id, documentationFiles) {
    let user = await userModel.findOne({ _id: id });
    let userDocuments = user.documents;

    for (let docFile of documentationFiles) {
      let documentUpdated = false;

      let docName = docFile.filename.split("-")[0];

      for (let userDoc of userDocuments) {
        if (userDoc.name === docName) {
          userDoc.reference = docFile.path;

          documentUpdated = true;
          break;
        }
      }

      if (!documentUpdated) {
        let newUserDocument = {
          name: docName,
          reference: docFile.path,
        };
        userDocuments.push(newUserDocument);
      }
    }

    await user.save();
  }
}
