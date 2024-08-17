import { DeliveryZone } from "../db/schema";
import { db } from "../db/sequelize-client";
import { CreateDeliveryZoneDto } from "../dto/create-delivery-zone.dto";
import { PointDto } from "../dto/point.dto";

class DeliveryZonesService {
  constructor() { }

  async create({ title, polygon }: CreateDeliveryZoneDto) {
    const createdDeliveryZone = await DeliveryZone.create({
      title, polygon
    })
    return createdDeliveryZone
  }

  async findAll({ longitude, latitude }: PointDto) {
    const point = db.fn('ST_GeomFromText', `POINT(${longitude} ${latitude})`, 4326);
    const deliveryZones = await DeliveryZone.findAll({
      where: db.where(db.fn('ST_Intersects', db.col('polygon'), point), true)
    });
    return deliveryZones
  }
}

export const deliveryZonesService = new DeliveryZonesService()