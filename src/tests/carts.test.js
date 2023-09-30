import chai from "chai";
import supertest from "supertest";
import { stringify } from "uuid";

const expect = chai.expect;
const requester = supertest("http://localhost:8080/api/");

describe("Carts API", () => {
    // Test para GET /carts
    describe("GET /cart", () => {
        it("debe devolver todos los carritos y este debe ser un array", async () => {
            const { _body } = await requester.get("cart");
            expect(_body.status).to.be.ok;
            expect(Array.isArray(_body.payload)).to.be.equal(true);
        });
    });
    // Test para POST /carts
    describe("Post /cart", () => {
        it("debe devolver ok cuando se intenta crear un nuevo carrito", async () => {
            const { _body } = await requester.get("cart");
            expect(_body.status).to.be.ok;
        });
    });
    // Test para post /carts/cid/products/pid
    describe("Post /:cid/products/:pid/quantity/:q", () => {
        it("debe devolver error cuando se intenta insertar un producto al carrito sin autenticar", async () => {
            const { _body } = await requester.post(
                "cart/65137d00ade7f15d9b240c89/products/64a5b0455791af450d212638/quantity/2"
            );
            console.log("_body", _body);
            expect(_body).to.be.ok;
        });
    });
});
