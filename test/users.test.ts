import * as chai from "chai"
import supertest from "supertest"
import { server } from "../src/server"

const expect = chai.expect

describe("Users", () => {
    it("Should be unauthorized", done => {
      supertest(server)
        .get("/whoami")
        .expect(401, done)
    })

    it("Should be return authorized user", done => {
      supertest(server)
        .get("/whoami")
        .set("Authorization", "Bearer test")
        .expect(200)
        .end((err: any, response: supertest.Response) => {
          expect(response.body.name).to.eq("test")
          done()
        })
    })
})
