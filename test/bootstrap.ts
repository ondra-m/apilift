import { start as dbStart } from "../src/database"
import { start as serverStart } from "../src/server"
import { User } from "../src/models/user"
import { Endpoint } from "../src/models/endpoint"
import { load } from "../src/config"

before(done => {
  (async () => {
    load("config.test.json")

    await dbStart()
    await serverStart()

    await Endpoint.deleteAll()

    await User.create({ name: "test", email: "test@test.test", accessToken: "test" })

    done()
  })()
})

after(done => {
  done()
  process.exit(0)
})
