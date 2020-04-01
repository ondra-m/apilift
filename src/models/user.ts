import { connection, callback } from "../database"
import { v1 as generateUUID } from "uuid";
import { resolve } from "dns";
import { Base } from "./base";


interface IUser {
  id?: number
  name?: string
  email?: string
  accessToken?: string
}

export class User extends Base {
  readonly tableName = "users"

  static create(attrs: IUser = {}) {
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
      connection.query("INSERT INTO ?? (name, email, accessToken) VALUES(?, ?, ?)", [this.tableName, this.attrs.name, this.attrs.email, this.attrs.accessToken], (error, results, fields) => {
        if (error) { throw error }

        resolve(results)
      })
    })
  }


}
