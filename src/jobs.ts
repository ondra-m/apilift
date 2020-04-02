import https from "https"
import http from "http"
import url from "url"
import { Endpoint } from "./models/endpoint"
import { MonitoringResult } from "./models/monitoring_result"

export class Worker {
  constructor(public waitBetweenRuns: number = 5) {}

  request(plainUrl: string): Promise<{ payload: string, httpCode: number }> {
    return new Promise(resolve => {

      const uri = url.parse(plainUrl)
      const requestModule = (uri.protocol === 'https:' ? https : http)

      requestModule.get(plainUrl, res => {
        res.setEncoding("utf8")

        let payload = ""
        res.on("data", data => {
          payload += data
        })

        res.on("end", () => {
          resolve({ payload, httpCode: res.statusCode || 200 })
        })
      })
    })
  }

  addSeconds(date: Date, days: number) {
    date.setSeconds(date.getSeconds() + days)
    return date
  }

  async perform() {
    const endpoints = await Endpoint.nextRuns()
    for (const endpoint of endpoints) {
      if (endpoint.attrs.url) {
        const { payload, httpCode } = await this.request(endpoint.attrs.url)

        await MonitoringResult.create({
          payload,
          httpCode,
          endpointId: endpoint.id,
          userId: endpoint.attrs.userId,
          checkedAt: new Date(),
        })

        endpoint.attrs.lastCheckedAt = new Date()
        endpoint.attrs.nextRunAt = this.addSeconds(endpoint.attrs.nextRunAt || new Date(), endpoint.attrs.interval || 10)
        await endpoint.save()
      }
    }
  }

  async run() {
    try {
      await this.perform()
    } catch (error) {
      console.error(error)
    }

    setTimeout(this.run.bind(this), this.waitBetweenRuns * 1000)
  }
}

const workers: Array<Worker> = []

// One worker is a good compromise between writing
// a mutex and not-working at all :)
export async function start() {
  workers.push(new Worker())
  workers.forEach(worker => worker.run())
}
