import { start as dbStart } from "../src/database"
import { start as serverStart } from "../src/server"
import { User } from "../src/models/user"
import { Endpoint } from "../src/models/endpoint"

before(done => {
  (async () => {
    await dbStart()
    await serverStart()

    await Endpoint.deleteAll()

    await User.create({ name: "test", email: "test@test.test", accessToken: "test" })

    done()
  })()
})

after(done => {
  // process.kill(process.pid, "SIGINT")


  done()
})
