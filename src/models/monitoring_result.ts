import { connection } from "../database"
import { Base } from "./base"
import { Endpoint } from "./endpoint"

interface IMonitoringResult {
  id?: number
  endpointId?: number
  userId?: number
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
      connection.query("INSERT INTO ?? (endpointId, checkedAt, httpCode, payload, userId) VALUES(?, ?, ?, ?, ?)", [this.tableName, this.attrs.endpointId, this.attrs.checkedAt, this.attrs.httpCode, this.attrs.payload, this.attrs.userId], (error, results) => {
        if (error) { throw error }
        if (results.insertId) { this.attrs.id = results.insertId }

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
    }
  }

  toShowApi(endpoint: Endpoint) {
    const result = this.toApi() as any
    result.payload = this.attrs.payload
    result.endpoint = endpoint.toApi()
    return result
  }

}
