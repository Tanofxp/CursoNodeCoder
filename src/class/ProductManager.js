import fs from "fs";

export default class ProductManager {
    constructor() {
        this.path = "src/class/files/Productos.json";
    }

    getProduct = async (limit) => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(data);
            if (limit) {
                return products.slice(0, limit);
            } else {
                return products;
            }
        } else {
            return [];
        }
    };

    addProduct = async (data) => {
        try {
            const product = data;
            const products = await this.getProduct();

            const lastproduct = products[products.length - 1];
            product.id = lastproduct ? lastproduct.id + 1 : 1;

            const existe = products.some((e) => e.code === product.code);
            if (existe) {
                throw new Error(
                    `El código ${product.code} ya se encuentra REGISTRADO`
                );
            }
            if (!product.status) {
                product.status = true;
            }

            const requiredFields = [
                "title",
                "descripcion",
                "price",
                "thumbnail",
                "code",
                "stock",
                "status",
            ];
            const hasAllFields = requiredFields.every((field) =>
                product.hasOwnProperty(field)
            );
            if (hasAllFields) {
                products.push(product);
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify(products, null, "\t")
                );
                return products;
            } else {
                throw new Error(
                    "Todos los campos son obligatorios. Revise los datos para poder continuar"
                );
            }
        } catch (error) {
            console.error("Error al agregar el auto:", error.message);
            throw error;
        }
    };

    getProductById = async (id) => {
        const JsonData = await this.getProduct();
        const exist = JsonData.filter((e) => e.id === id);
        if (exist.length !== 0) {
            return exist;
        } else {
            return console.error("Not Found");
        }
    };

    updateProductById = async (id, product) => {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const jsonData = JSON.parse(data);

        jsonData.forEach((e) => {
            for (let prop in product) {
                if (id === e["id"]) {
                    e[prop] = product[prop];
                }
            }
        });

        await fs.promises.writeFile(
            this.path,
            JSON.stringify(jsonData, null, "\t")
        );
        console.log(`Se modificó el producto con id ${id}`);
        return jsonData.find((e) => e.id === id);
    };

    async deleteProduct(id) {
        const data = await this.getProduct();
        const index = data.findIndex((product) => product.id === id);

        if (index !== -1) {
            data.splice(index, 1);
            try {
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify(data, null, "\t")
                );
            } catch (error) {
                throw new Error("Error while saving product");
            }
        } else {
            throw new Error("Product not found");
        }
    }

    getProductsInStock = async () => {
        const products = await this.getProduct();

        const inStock = [];

        inStock.push(...products.filter((product) => product.stock > 0));

        return inStock;
    };
}
