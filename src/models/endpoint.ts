import validator from "validator";
import { connection } from "../database";
import { User } from "./user";
import { resolve } from "dns";
import { Base } from "./base";

interface IEndpoint {
  id?: number
  name?: string
  url?: string
  interval?: number
  userId?: number
  lastCheckedAt?: Date
  createdAt?: Date
}

interface Error {
  attribute: string
  messages: string
}

export class Endpoint extends Base {
  static readonly tableName = "endpoints"

  static where(conditions: IEndpoint): Promise<Array<Endpoint>> {
    return new Promise(resolve => {
      let sql = "SELECT * FROM ??"
      let tokens = []
      let values = [this.tableName]

      for (const [attribute, value] of Object.entries(conditions)) {
        tokens.push("?? = ?")
        values.push(attribute, value)
      }

      if (tokens.length) {
        sql = `${sql} WHERE ${tokens.join(" AND ")}`
      }

      connection.query(sql, values, (error, results) => {
        if (error) { throw error }

        const items = []
        for (const row of results) {
          items.push(new this(row))
        }
        resolve(items)
      })
    })
  }

  constructor(public attrs: IEndpoint) {
    super()
  }

  validate() {
    const errors: Array<Error> = []

    if (!this.attrs.name || !validator.isLength(this.attrs.name, { max: 100 })) {
      errors.push({ attribute: "name", messages: "Name is required" })
    }

    if (!this.attrs.url || !validator.isURL(this.attrs.url)) {
      errors.push({ attribute: "url", messages: "URL is required" })
    }

    if (!this.attrs.interval || !validator.isInt(this.attrs.interval.toString(), { min: 1 })) {
      errors.push({ attribute: "interval", messages: "Interval is not filled or is too short" })
    }

    return errors
  }

  save(): Promise<Endpoint> {
    return new Promise((resolve, reject) => {
      const errors = this.validate()

      if (errors.length) {
        return reject(errors)
      }

      let sql
      let values

      if (this.attrs.id) {
        sql = "UPDATE ?? SET name=?, url=?, `interval`=?, lastCheckedAt=? WHERE id=?"
        values = [Endpoint.tableName, this.attrs.name, this.attrs.url, this.attrs.interval, this.attrs.lastCheckedAt, this.attrs.id]
      }
      else {
        sql = "INSERT INTO ?? (name, url, `interval`, userId, createdAt) VALUES (?, ?, ?, ?, ?)"
        values = [Endpoint.tableName, this.attrs.name, this.attrs.url, this.attrs.interval, this.attrs.userId, new Date()]
      }

      connection.query(sql, values, (error, results) => {
        if (error) {
          reject([{ attribute: "base", messages: error.message }])
        }
        else {
          if (results.insertId) { this.attrs.id = results.insertId }
          resolve(this)
        }
      })
    })
  }

  delete(): Promise<Endpoint> {
    return new Promise(resolve => {
      connection.query("DELETE FROM ?? WHERE id = ?", [Endpoint.tableName, this.id], (error, results) => {
        this.isDeleted = true
        resolve(this)
      })
    })
  }

  toApi() {
    return {
      id: this.attrs.id,
      name: this.attrs.name,
      url: this.attrs.url,
      interval: this.attrs.interval,
      userId: this.attrs.userId,
      lastCheckedAt: this.attrs.lastCheckedAt,
      createdAt: this.attrs.createdAt,
    }
  }

}
