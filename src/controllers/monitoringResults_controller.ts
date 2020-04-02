import restify from "restify"
import restifyErrors from "restify-errors"
import { Request, Response, Next } from "restify"
import { BaseController } from "./base_controller"
import { User } from "../models/user"
import { Endpoint } from "../models/endpoint"
import { MonitoringResult } from "../models/monitoringResult"

export class MonitoringResultsController extends BaseController {

  constructor(server: restify.Server) {
    super(server)
  }

  start() {
    this.server.get("/monitoring_results", this.auth, this.index.bind(this))
    this.server.get("/monitoring_results/:id", this.auth, this.show.bind(this))
  }

  index(req: Request, res: Response, next: Next) {
    const user: User = req.get("user")

    MonitoringResult
      .where({ userId: user.id }, [["checkedAt", "DESC"]], 10)
      .then(results => {
        res.json(results.map(result => result.toApi()))
        next()
      })
  }

  show(req: Request, res: Response, next: Next) {
    const user: User = req.get("user")

    MonitoringResult
      .where({ id: req.params.id, userId: user.id })
      .then(results => {
        const result = results[0]

        if (!result) {
          res.send(404)
          next()
        }
        else {
          Endpoint.where({ id: result.attrs.endpointId })
            .then(endpoints => {
              // Within referential integrity lets assumed the value always exists
              const endpoint = endpoints[0]

              res.json(result.toShowApi(endpoint))
              next()
            })
        }
      })
  }

}
