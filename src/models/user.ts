import { connection } from "../database"
import { v1 as generateUUID } from "uuid"
import { Base } from "./base"

interface IUser {
  id?: number
  name?: string
  email?: string
  accessToken?: string
}

export class User extends Base<IUser, User>() {
  static get tableName() {
    return "users"
  }

  static create(attrs: IUser) {
    return new this(attrs).create()
  }

  static async findByAccessToken(token?: string) {
    if (!token) {
      return null
    }

    return new Promise(resolve => {
      connection.query("SELECT * FROM users WHERE accessToken = ? LIMIT 1", [token], (error, results) => {
        if (error) { throw error }

        if (!results.length) {
          resolve(null)
        }
        else {
          resolve(new User(results[0]))
        }

      })
    })

  }

  constructor(public attrs: IUser = {}) {
    super()

    if (!attrs.accessToken) {
      attrs.accessToken = generateUUID()
    }
  }

  create() {
    return new Promise(resolve => {
      connection.query("INSERT INTO ?? (name, email, accessToken) VALUES(?, ?, ?)", [User.tableName, this.attrs.name, this.attrs.email, this.attrs.accessToken], (error, results, fields) => {
        if (error) { throw error }

        resolve(results)
      })
    })
  }

  toApi() {
    return {
      id: this.attrs.id,
      name: this.attrs.name,
      email: this.attrs.email,
      accessToken: this.attrs.accessToken,
    }
  }

}
