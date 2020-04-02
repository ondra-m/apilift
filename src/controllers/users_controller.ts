import restify from "restify"
import { Request, Response, Next } from "restify"
import { BaseController } from "./base_controller"
import { User } from "../models/user"

export class UsersController extends BaseController {
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
