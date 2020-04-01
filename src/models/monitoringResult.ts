import validator from "validator"
import { connection } from "../database"
import { User } from "./user"
import { resolve } from "dns"
import { Base } from "./base"

interface IMonitoringResult {
  id?: number
  endpointId?: number
  checkedAt?: Date
  httpCode?: number
  payload?: string
}

export class MonitoringResult extends Base<IMonitoringResult, MonitoringResult>() {

  static get tableName() {
    return "monitoringResults"
  }

  static create(attrs: IMonitoringResult) {
    return new this(attrs).create()
  }

  constructor(public attrs: IMonitoringResult) {
    super()
  }

  create(): Promise<boolean> {
    return new Promise(resolve => {
      connection.query("INSERT INTO ?? (endpointId, checkedAt, httpCode, payload) VALUES(?, ?, ?, ?)", [this.tableName, this.attrs.endpointId, this.attrs.checkedAt, this.attrs.httpCode, this.attrs.payload], (error, results) => {
        if (error) { throw error }

        resolve(true)
      })
    })
  }

  toApi() {
    return {
      id: this.attrs.id,
      endpointId: this.attrs.endpointId,
      checkedAt: this.attrs.checkedAt,
      httpCode: this.attrs.httpCode,
      payload: this.attrs.payload,
    }
  }

}
