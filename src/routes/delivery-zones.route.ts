import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { ValidationError } from "sequelize";
import { CreateDeliveryZoneDto } from "../dto/create-delivery-zone.dto";
import CreateDeliveryZoneSchema from '../dto/create-delivery-zone.dto.json';
import DeliveryZoneSchema from '../dto/delivery-zone.dto.json';
import ErrorSchema from '../dto/error-schema.dto.json';
import { PointDto } from "../dto/point.dto";
import PointSchema from '../dto/point.dto.json';
import { deliveryZonesService } from "../services/delivery-zones.service";

const deliveryZonesRoutes: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  fastify.post('/', {
    schema: {
      body: CreateDeliveryZoneSchema,
      response: {
        201: DeliveryZoneSchema,
        400: { description: 'Validation error', ...ErrorSchema },
        422: { description: 'Already exists', ...ErrorSchema }
      }
    }
  }, async (request: FastifyRequest<{ Body: CreateDeliveryZoneDto }>, reply: FastifyReply) => {
    try {
      const createdDeliveryZone = await deliveryZonesService.create(request.body)
      reply
        .code(201)
        .send(createdDeliveryZone)
    }
    catch (error) {
      console.error(error)
      if (error instanceof ValidationError) {
        reply
          .code(422)
          .send({
            statusCode: 422,
            code: 'UNPROCESSABLE_ENTITY',
            error: 'Unprocessable Entity',
            message: 'Already exists'
          })
      }
      else {
        reply
          .code(500)
          .send({
            statusCode: 500,
            code: 'INTERNAL_SERVER_ERROR',
            error: 'Internal Server Error',
            message: 'Internal Server Error'
          })
      }
    }
  })

  fastify.get('/', {
    schema: {
      querystring: PointSchema,
      response: {
        200: { type: 'array', items: DeliveryZoneSchema },
        400: { description: 'Validation error', ...ErrorSchema },
      }
    }
  }, async (request: FastifyRequest<{ Querystring: PointDto }>, reply) => {
    try {
      const deliveryZones = await deliveryZonesService.findAll(request.query)
      reply
        .code(200)
        .send(deliveryZones)
    }
    catch (error) {
      console.error(error)
      reply
        .code(500)
        .send({
          statusCode: 500,
          code: 'INTERNAL_SERVER_ERROR',
          error: 'Internal Server Error',
          message: 'Internal Server Error'
        })
    }
  })
}

export default deliveryZonesRoutes;