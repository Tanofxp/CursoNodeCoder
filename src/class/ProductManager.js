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
        const producto = data;
        console.log("esto", producto);
        const products = await this.getProduct();

        if (products.length === 0) {
            producto.id = 1;
        } else {
            producto.id = products[products.length - 1].id + 1;
        }
        const existe = products.filter((e) => e.code === producto.code);

        if (existe.length !== 0) {
            return console.error(
                "Code",
                producto.code,
                " ya se encuentra REGISTRADO"
            );
        }
        if (
            (producto.title,
            producto.descripcion,
            producto.price,
            producto.thumbnail,
            producto.code,
            producto.stock)
        ) {
            products.push(producto);

            await fs.promises.writeFile(
                this.path,
                JSON.stringify(products, null, "\t")
            );
        } else {
            console.error(
                "Todos los campos son Obligatorios revise los datos para poder continuar"
            );
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
        return console.log(`Se cambio ${product} con exito!`);
    };
}
