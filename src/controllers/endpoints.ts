import restify from "restify";
import restifyErrors from "restify-errors";
import { Request, Response, Next } from "restify";
import { Base } from "./base";
import { User } from "../models/user";
import { Endpoint } from "../models/endpoint";

export class Endpoints extends Base {
  constructor(server: restify.Server) {
    super(server)
  }

  start() {
    this.server.get("/endpoints", this.auth, this.index.bind(this))
    this.server.get("/endpoints/:id", this.auth, this.show.bind(this))
    this.server.post("/endpoints", this.auth, this.create.bind(this))
    this.server.patch("/endpoints/:id", this.auth, this.update.bind(this))
    this.server.del("/endpoints/:id", this.auth, this.delete.bind(this))
  }

  index(req: Request, res: Response, next: Next) {
    const user: User = req.get("user")

    Endpoint
      .where({ userId: user.attrs.id })
      .then(endpoints => {
        res.send(endpoints.map(endpoint => endpoint.toApi()))
        next()
      })
  }

  show(req: Request, res: Response, next: Next) {
    const user: User = req.get("user")

    Endpoint
      .where({ userId: user.attrs.id, id: req.params.id })
      .then(endpoints => {
        if (endpoints.length) {
          res.json(endpoints[0].toApi())
        }
        else {
          res.send(404)
        }

        next()
      })
  }

  create(req: Request, res: Response, next: Next) {
    const user: User = req.get("user")

    const endpoint = new Endpoint({
      userId: user.attrs.id,
    })

    this.updateAndSave(endpoint, req, res, next)
  }

  update(req: Request, res: Response, next: Next) {
    const user: User = req.get("user")

    Endpoint
      .where({ userId: user.attrs.id, id: req.params.id })
      .then(endpoints => {
        const endpoint = endpoints[0]

        if (endpoint) {
          this.updateAndSave(endpoint, req, res, next)
        }
        else {
          res.send(404)
          next()
        }
      })
  }

  delete(req: Request, res: Response, next: Next) {
    const user: User = req.get("user")

    Endpoint
      .where({ userId: user.id, id: req.params.id })
      .then(endpoints => {
        const promises = endpoints.map(endpoint => endpoint.delete())

        Promise.all(promises)
          .then(endpoints => {
            res.send({deletedIds: endpoints.map(e => e.id)})
            next()
          })
      })
  }

  private updateAndSave(endpoint: Endpoint, req: Request, res: Response, next: Next) {
    if(req.params.name) { endpoint.attrs.name = req.params.name }
    if(req.params.url) { endpoint.attrs.url = req.params.url }
    if(req.params.interval) { endpoint.attrs.interval = req.params.interval }

    const codeIfSuccess = endpoint.id ? 200 : 201

    endpoint.save()
      .then(endpoint => {
        res.json(codeIfSuccess, endpoint.toApi())
        next()
      })
      .catch(errors => {
        res.send(422, errors)
        next(new restifyErrors.UnprocessableEntityError())
      })
  }

}
