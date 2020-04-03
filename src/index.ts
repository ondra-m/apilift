import { start as dbStart } from "./database"
import { start as serverStart } from "./server"
import { start as jobsStart } from "./jobs"
import { load } from "./config"

(async () => {
  load()

  await dbStart()
  await jobsStart()
  await serverStart()
})()
