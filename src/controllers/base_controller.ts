import restify from "restify"
import errors from "restify-errors"
import { Request, Response, Next } from "restify"
import { User } from "../models/user"

// These methods are added via `restify.plugins.pre.context`
declare module "restify" {
  interface Request {
    set(key: string, value: any): void
    get(key: string): any
  }
}

export abstract class BaseController {
  constructor(public server: restify.Server) {}

  auth(req: Request, res: Response, next: Next) {
    User.findByAccessToken(req.authorization?.credentials).then(user => {
      if (user) {
        req.set("user", user)
        next()
      } else {
        next(new errors.UnauthorizedError())
      }
    })
  }

}
