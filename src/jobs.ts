import https from "https"
import { Endpoint } from "./models/endpoint"
import { MonitoringResult } from "./models/monitoringResult"

class Worker {
  constructor(public waitBetweenRuns: number = 5) {}

  request(url: string): Promise<{ payload: string, httpCode: number }> {
    return new Promise(resolve => {
      https.get(url, res => {
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

  async run() {
    try {
      const endpoints = await Endpoint.nextRuns()
      for (const endpoint of endpoints) {
        if (endpoint.attrs.url) {
          const { payload, httpCode } = await this.request(endpoint.attrs.url)

          MonitoringResult.create({
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
