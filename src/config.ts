import { readFileSync, existsSync } from "fs"

export let config: { database: any, webserver: any }

export function load(configFile?: string) {
  config = {
    database: {
      host: process.env.APILIFT_DB_HOST,
      user: process.env.APILIFT_DB_USER,
      password: process.env.APILIFT_DB_PASSWORD,
      database: process.env.APILIFT_DB_NAME,
    },
    webserver: {
      port: process.env.APILIFT_WEB_PORT,
    },
  }

  configFile = configFile || process.argv[2]

  if (configFile && existsSync(configFile)) {
    const jsonConfig = JSON.parse(readFileSync(configFile).toString())

    Object.assign(config.database, jsonConfig.database)
    Object.assign(config.webserver, jsonConfig.webserver)
  }
}
