import restify from "restify"
import { Request, Response, Next } from "restify"
import { Base } from "./base"
import { User } from "../models/user"

export class Users extends Base {
  constructor(server: restify.Server) {
    super(server)
  }

  start() {
    this.server.get("/whoami", this.auth, this.whoami.bind(this))
  }

  whoami(req: Request, res: Response, next: Next) {
    const user: User = req.get("user")

    res.json(user.toApi())
    next()
  }

}
