import dotenv from "dotenv"

const NODE_ENV = process.env.NODE_ENV || "development"
dotenv.config({
  path: `.env.${NODE_ENV}`,
})
console.log(`Using .env.${NODE_ENV} environments.`)

const config = {
  NODE_ENV: NODE_ENV,
  PORT: process.env.PORT,
  POSTGRESQL_URL: process.env.POSTGRESQL_URL,
}
console.log(`Config: ${JSON.stringify(config, null, 2)}\n`)

export { config }
