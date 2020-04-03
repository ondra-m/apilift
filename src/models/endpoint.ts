import validator from "validator"
import { connection } from "../database"
import { Base } from "./base"

interface IEndpoint {
  id?: number
  name?: string
  url?: string
  interval?: number
  userId?: number
  nextRunAt?: Date
  lastCheckedAt?: Date
  createdAt?: Date
}

interface Error {
  attribute: string
  messages: string
}

export class Endpoint extends Base<IEndpoint, Endpoint>() {
  static get tableName() {
    return "endpoints"
  }

  static nextRuns(): Promise<Array<Endpoint>> {
    return new Promise(resolve => {
      connection.query("SELECT * FROM ?? WHERE nextRunAt IS NULL OR nextRunAt <= ?", [this.tableName, new Date()], (error, results) => {
        if (error) { throw error }

        const endpoints = []
        for (const attr of results) {
          endpoints.push(new this(attr))
        }
        resolve(endpoints)
      })
    })
  }

  constructor(public attrs: IEndpoint) {
    super()
  }

  validate() {
    const errors: Array<Error> = []

    if (!this.attrs.name || !validator.isLength(this.attrs.name, { min: 1, max: 100 })) {
      errors.push({ attribute: "name", messages: "Name is required" })
    }

    if (!this.attrs.url || !validator.isURL(this.attrs.url, { require_protocol: true })) {
      errors.push({ attribute: "url", messages: "URL is not valid" })
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
        sql = "UPDATE ?? SET name=?, url=?, `interval`=?, lastCheckedAt=?, nextRunAt=? WHERE id=?"
        values = [Endpoint.tableName, this.attrs.name, this.attrs.url, this.attrs.interval, this.attrs.lastCheckedAt, this.attrs.nextRunAt, this.attrs.id]
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
