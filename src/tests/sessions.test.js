import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Sessions  API", () => {
    describe("POST /api/sessions/login", () => {
        it("debe logear el usuario", async () => {
            const User = {
                email: "adminCoder@coder.com",
                password: "adminCod3r123",
            };
            const { _body } = await requester
                .post("/api/sessions/login")
                .send(User);

            expect(_body.status).to.be.ok;
        });
    });
    describe("POST /api/sessions/login", () => {
        it("debe dar error logear un usuario inexistente", async () => {
            const User = {
                email: "1adminCoder@coder.com",
                password: "adminCod3r123",
            };
            const { _body } = await requester
                .post("/api/sessions/login")
                .send(User);
            expect(_body.status).to.be.equal("error");
        });
    });
});
