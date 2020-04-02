import * as chai from "chai"
import supertest from "supertest"
import { server } from "../src/server"
import { Endpoint } from "../src/models/endpoint"
import { MonitoringResult } from "../src/models/monitoring_result"
import { User } from "../src/models/user"
import { it } from "mocha"

const expect = chai.expect

describe("Endpoints", () => {
  let endpoint: Endpoint
  let monitoringResult: MonitoringResult
  let user: User | null

  beforeEach(done => {
    (async () => {
      await Endpoint.deleteAll()
      await MonitoringResult.deleteAll()

      user = await User.first()

      endpoint = new Endpoint({
        name: "Test",
        url: "http://applifting.cz",
        interval: 10,
        userId: user?.id,
      })

      await endpoint.save()

      monitoringResult = new MonitoringResult({
        payload: "test",
        httpCode: 200,
        endpointId: endpoint.id,
        userId: endpoint.attrs.userId,
        checkedAt: new Date(),
      })

      await monitoringResult.create()

      done()
    })()
  })

  it("GET /monitoring_results", done => {
    supertest(server)
      .get("/monitoring_results")
      .set("Authorization", `Bearer ${user?.attrs?.accessToken}`)
      .expect(200)
      .end((err: any, response: supertest.Response) => {
        const record = response.body[0]

        expect(record.httpCode).to.eq(200)
        expect(record.endpointId).to.eq(endpoint.id)

        done()
      })
  })

  describe("GET /monitoring_results/:id", () => {
    it("should return 404", done => {
      supertest(server)
        .get(`/monitoring_results/99999999999`)
        .set("Authorization", `Bearer ${user?.attrs?.accessToken}`)
        .expect(404, done)
    })

    it("the record is returned", done => {
      supertest(server)
        .get(`/monitoring_results/${monitoringResult.id}`)
        .set("Authorization", `Bearer ${user?.attrs?.accessToken}`)
        .expect(200)
        .end((err: any, response: supertest.Response) => {
          expect(response.body.payload).to.eq("test")
          expect(response.body.endpoint.name).to.eq(endpoint.attrs.name)
          expect(response.body.endpoint.url).to.eq(endpoint.attrs.url)

          done()
        })
    })
  })

})
