import { Sequelize } from "sequelize";
import { config } from "../core/config";

const db = new Sequelize(config.POSTGRESQL_URL, {
  logging: config.NODE_ENV === 'development' ? console.log : false,
})

export { db }