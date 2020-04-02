import { connection } from "../database"
import { NotImplementedError } from "restify-errors"

// hm, it works
export function Base<T, A>() {
  abstract class Base {
    abstract attrs: any
    isDeleted: boolean = false

    static get tableName(): string {
      throw new NotImplementedError()
    }

    static first(): Promise<A | null> {
      return new Promise(resolve => {
        connection.query("SELECT * FROM ?? LIMIT 1", [this.tableName], (error, results) => {
          if (error) { throw error }

          if (results.length) {
            resolve(new (<any>this)(results[0]))
          } else {
            resolve(null)
          }
        })
      })
    }

    static count(): Promise<number> {
      return new Promise(resolve => {
        connection.query("SELECT COUNT(*) as count FROM ??", [this.tableName], (error, results) => {
          if (error) { throw error }
          resolve(results[0].count)
        })
      })
    }

    static where(conditions: T, order?: Array<[string, string]>, limit?: number): Promise<Array<A>> {
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

        if (order) {
          sql += " ORDER BY"
          for (const item of order) {
            sql += ` ${item[0]} ${item[1]}`
          }
        }

        if (limit && limit > 0) {
          sql += ` LIMIT ${limit}`
        }

        connection.query(sql, values, (error, results) => {
          if (error) { throw error }

          const items = []
          for (const row of results) {
            items.push(new (<any>this)(row))
          }
          resolve(items)
        })
      })
    }

    static deleteAll() {
      return new Promise(resolve => {
        connection.query("TRUNCATE TABLE ??", [this.tableName], (error, results) => {
          resolve()
        })
      })
    }

    constructor() {}

    public get id(): number {
      return this.attrs.id
    }

    public get tableName(): string {
      return Object.getPrototypeOf(this).constructor.tableName
    }

    delete(): Promise<A> {
      return new Promise(resolve => {
        connection.query("DELETE FROM ?? WHERE id = ?", [this.tableName, this.id], (error, results) => {
          this.isDeleted = true
          resolve(<any>this)
        })
      })
    }

  }

  return Base
}
