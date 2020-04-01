import mysql from "mysql"
import path from "path"
import { readFileSync } from "fs"
import * as seed from "./migrate/seed";
import { queryCallback } from "mysql";
import { resolve } from "dns";

export const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "apilift",
})


export declare type callback = queryCallback



async function createTableIfNotExists(tableName: string): Promise<boolean> {
  return new Promise(resolve => {
    connection.query("SHOW TABLES LIKE ?", [tableName], (error, results, fields) => {
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
  await createTableIfNotExists("users")
  await createTableIfNotExists("endpoints")
  await seedIfNoRecords("users", seed.createUsers)
}



//

// function createTableIfNotExists(tableName: string) {
//   const sqlFile = path.join(__dirname, "sqls", `create_${tableName}`)

//   const a = query("SHOW TABLES LIKE '%tablename%'")

//     console.log(2)
// }

// createTableIfNotExists("users")

//     console.log(3)
