import * as chai from "chai"
import { Endpoint } from "../src/models/endpoint"
import { User } from "../src/models/user"
import { it } from "mocha"
import { Worker } from "../src/jobs"
import { MonitoringResult } from "../src/models/monitoring_result"
import nock from "nock"

const expect = chai.expect

describe("Jobs", () => {
  let endpoint: Endpoint
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

      nock("http://applifting.cz")
        .get("/")
        .reply(200, "test")

      done()
    })()
  })

  it("#run", done => {
    const worker = new Worker()
    worker.perform()
      .then(() => {
        MonitoringResult.where({})
          .then(results => {
            expect(results.length).to.eq(1)
            expect(results[0].attrs.httpCode).to.eq(200)
            expect(results[0].attrs.payload).to.eq("test")
            done()
          })
      })
  })

})
