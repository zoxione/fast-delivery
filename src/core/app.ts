import Fastify, { FastifyServerOptions } from 'fastify'
import FastifySwagger from '@fastify/swagger'
import FastifySwaggerUi from '@fastify/swagger-ui'
import deliveryZonesRoutes from '../routes/delivery-zones.route'
import { db } from '../db/sequelize-client'

const buildApp = async (opts: FastifyServerOptions = {}) => {
  const app = Fastify(opts)

  // Swagger
  await app.register(FastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Fast delivery API',
        description: '',
        version: '0.1.0'
      },
    }
  });
  await app.register(FastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next() },
      preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
    transformSpecificationClone: true
  })

  // Database
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
  try {
    await db.sync({ alter: true })
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to sync the database:', error);
    process.exit(1);
  }

  // Routes
  app.register(deliveryZonesRoutes, { prefix: '/api/v1/delivery-zones' })

  return app
}

export { buildApp }
