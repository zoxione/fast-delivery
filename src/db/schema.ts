import { DataTypes } from "sequelize";
import { db } from "./sequelize-client";

const DeliveryZone = db.define(
  'delivery_zone',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    polygon: {
      type: DataTypes.GEOMETRY("POLYGON", 4326),
      allowNull: false
    }
  },
  {
    timestamps: false
  },
);

export { DeliveryZone }