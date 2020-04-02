import * as chai from "chai"
import supertest from "supertest"
import { server } from "../src/server"
import { Endpoint } from "../src/models/endpoint"
import { User } from "../src/models/user"
import { it } from "mocha"

const expect = chai.expect

describe("Endpoints", () => {
  let endpoints: Array<Endpoint>
  let user: User | null

  beforeEach(done => {
    (async () => {
      await Endpoint.deleteAll()

      user = await User.first()

      const endpoint = new Endpoint({
        name: "Test",
        url: "http://applifting.cz",
        interval: 10,
        userId: user?.id,
      })

      await endpoint.save()
      endpoints = [endpoint]
      done()
    })()
  })

  it("GET /endpoints", done => {
    supertest(server)
      .get("/endpoints")
      .set("Authorization", `Bearer ${user?.attrs?.accessToken}`)
      .expect(200)
      .end((err: any, response: supertest.Response) => {
        const record = response.body[0]

        expect(record.userId).to.eq(user?.attrs?.id)
        expect(record.name).to.eq("Test")
        expect(record.url).to.eq("http://applifting.cz")

        done()
      })
  })

  describe("GET /endpoints/:id", () => {
    it("should return 404", done => {
      supertest(server)
        .get(`/endpoints/99999999999`)
        .set("Authorization", `Bearer ${user?.attrs?.accessToken}`)
        .expect(404, done)
    })

    it("the record is returned", done => {
      const endpoint = endpoints[0]

      supertest(server)
        .get(`/endpoints/${endpoint.id}`)
        .set("Authorization", `Bearer ${user?.attrs?.accessToken}`)
        .expect(200)
        .end((err: any, response: supertest.Response) => {
          expect(response.body.userId).to.eq(endpoint.id)
          expect(response.body.name).to.eq(endpoint.attrs.name)
          expect(response.body.url).to.eq(endpoint.attrs.url)

          done()
        })
    })
  })

  it("POST /endpoints", done => {
    supertest(server)
      .post("/endpoints")
      .set("Authorization", `Bearer ${user?.attrs?.accessToken}`)
      .set("Accept", "application/json")
      .send({
        "interval": 10,
        "name": "testtesttest",
        "url": "http://seznam.cz",
      })
      .expect(201)
      .end((err: any, response: supertest.Response) => {
        Endpoint.count()
          .then(count => {
            expect(count).to.eq(2)
            done()
          })
      })
  })

  it("PATCH /endpoints", done => {
    const endpoint = endpoints[0]
    expect(endpoint.attrs.name).to.not.eq("testtesttest")

    supertest(server)
      .patch(`/endpoints/${endpoint.id}`)
      .set("Authorization", `Bearer ${user?.attrs?.accessToken}`)
      .set("Accept", "application/json")
      .send({
        "name": "testtesttest",
      })
      .expect(200)
      .end((err: any, response: supertest.Response) => {
        expect(response.body.id).to.eq(endpoint.id)
        expect(response.body.name).to.eq("testtesttest")
        done()
      })
  })

  it("DELETE /endpoints", done => {
    const endpoint = endpoints[0]

    supertest(server)
      .delete(`/endpoints/${endpoint.id}`)
      .set("Authorization", `Bearer ${user?.attrs?.accessToken}`)
      .set("Accept", "application/json")
      .expect(200)
      .end((err: any, response: supertest.Response) => {
        Endpoint.count()
          .then(count => {
            expect(count).to.eq(0)
            done()
          })
      })
  })

})
