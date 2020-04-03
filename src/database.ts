import path from "path"
import { readFileSync } from "fs"
import mysql from "mysql"
import * as seed from "./migrate/seed"
import { config } from "./config"

export let connection: mysql.Pool

async function createTableIfNotExists(tableName: string): Promise<boolean> {
  return new Promise(resolve => {
    connection.query("SHOW TABLES LIKE ?", [tableName], (error, results, fields) => {
      if (error) { throw error }

      if (results.length) {
        resolve(true)
      }
      else {
        const sqlFile = path.join(__dirname, "migrate", `create_${tableName}.sql`)
        const content = readFileSync(sqlFile)

        connection.query(content.toString(), (error, results, fields) => {
          if (error) { throw error }

          console.log(`Table "${tableName}" created`)
          resolve(true)
        })
      }

    })
  })
}

async function seedIfNoRecords(tableName: string, seedFunc: Function) {
  return new Promise(resolve => {
    connection.query("SELECT COUNT(*) as count FROM ??", [tableName], (error, results, fields) => {
      if (results[0].count) {
        resolve(false)
      }
      else {
        seedFunc().then(() => resolve(true))
      }
    })
  })
}

export async function start() {
  connection = mysql.createPool(config.database)

  await createTableIfNotExists("users")
  await createTableIfNotExists("endpoints")
  await createTableIfNotExists("monitoringResults")
  await seedIfNoRecords("users", seed.createUsers)
}
