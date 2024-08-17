import { buildApp } from './core/app'
import { config } from './core/config'

(async () => {
  const app = await buildApp({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty'
      }
    }
  })

  await app.ready()
  app.swagger()

  app.listen({ port: config.PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
})()
