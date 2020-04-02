import restify from "restify"
import { EndpointsController } from "./controllers/endpoints_controller"
import { UsersController } from "./controllers/users_controller"
import { MonitoringResultsController } from "./controllers/monitoring_results_controller"

export let server: restify.Server

export function start() {
  return new Promise(resolve => {
    server = restify.createServer()

    server.pre(restify.plugins.pre.context())
    server.use(restify.plugins.authorizationParser())
    server.use(restify.plugins.bodyParser({
      mapParams: true,
    }))

    new EndpointsController(server).start()
    new UsersController(server).start()
    new MonitoringResultsController(server).start()

    server.listen(3000, () => {
      console.log("%s listening at %s", server.name, server.url)
      resolve()
    })
  })
}
