import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080/api/");

describe("Productos API", () => {
    describe("GET /products", () => {
        it("debe devolver todos los productos y este debe ser un array", async () => {
            const { _body } = await requester.get("products/");
            console.log(_body.status);
            expect(_body.status).to.be.ok;
            expect(Array.isArray(_body.product.docs)).to.be.equal(true);
        });
    });
});
