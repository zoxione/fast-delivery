import supertest from 'supertest';
import { buildApp } from '../src/core/app';

import { DeliveryZone } from '../src/db/schema';
import TestPoints from './app.test-points.json';
import TestPolygons from './app.test-polygons.json';
import { FastifyInstance } from 'fastify';

describe('Тестирование эндпоинта /delivery-zones', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  })

  afterAll(async () => {
    await DeliveryZone.destroy({ truncate: true })
    await app.close()
  })

  test('[POST] Создание прямоугольного полигона', async () => {
    const response = await supertest(app.server)
      .post('/api/v1/delivery-zones')
      .send(TestPolygons[0])
      .expect(201)
    expect(response.body.title).toEqual(TestPolygons[0].title);
  });

  test('[POST] Создание полигона с несколькими кольцами', async () => {
    const response = await supertest(app.server)
      .post('/api/v1/delivery-zones')
      .send(TestPolygons[1])
      .expect(201)
    expect(response.body.title).toEqual(TestPolygons[1].title);
  });

  test('[POST] Создание кругового полигона', async () => {
    const response = await supertest(app.server)
      .post('/api/v1/delivery-zones')
      .send(TestPolygons[2])
      .expect(201)
    expect(response.body.title).toEqual(TestPolygons[2].title);
  });

  test('[POST/E] Создание полигона с некорректным данными', async () => {
    const response = await supertest(app.server)
      .post('/api/v1/delivery-zones')
      .send({
        title: TestPolygons[0].title
      })
      .expect(400)
    expect(response.body.code).toEqual("FST_ERR_VALIDATION");
  });

  test('[POST/E] Создание полигона с уже существующим названием', async () => {
    const response = await supertest(app.server)
      .post('/api/v1/delivery-zones')
      .send(TestPolygons[0])
      .expect(422)
    expect(response.body.code).toEqual('UNPROCESSABLE_ENTITY');
  });

  test('[GET] Получение прямоугольного полигона', async () => {
    const { longitude, latitude } = TestPoints['v home']
    const response = await supertest(app.server)
      .get(`/api/v1/delivery-zones?longitude=${longitude}&latitude=${latitude}`)
      .expect(200)
    expect(response.body.length).toEqual(1);
    expect(response.body[0].title).toEqual(TestPolygons[0].title);
    expect(response.body[0].polygon).toEqual(TestPolygons[0].polygon);
  });

  test('[GET] Получение полигона с несколькими кольцами', async () => {
    const { longitude, latitude } = TestPoints['okolo hurula']
    const response = await supertest(app.server)
      .get(`/api/v1/delivery-zones?longitude=${longitude}&latitude=${latitude}`)
      .expect(200)
    expect(response.body.length).toEqual(1);
    expect(response.body[0].title).toEqual(TestPolygons[1].title);
    expect(response.body[0].polygon).toEqual(TestPolygons[1].polygon);
  });

  test('[GET] Получение кругового полигона', async () => {
    const { longitude, latitude } = TestPoints['v kruge']
    const response = await supertest(app.server)
      .get(`/api/v1/delivery-zones?longitude=${longitude}&latitude=${latitude}`)
      .expect(200)
    expect(response.body.length).toEqual(1);
    expect(response.body[0].title).toEqual(TestPolygons[2].title);
    expect(response.body[0].polygon).toEqual(TestPolygons[2].polygon);
  });

  test('[GET] Получение двух полигонов на пересечении', async () => {
    const { longitude, latitude } = TestPoints['dva polygona']
    const response = await supertest(app.server)
      .get(`/api/v1/delivery-zones?longitude=${longitude}&latitude=${latitude}`)
      .expect(200)
    expect(response.body.length).toEqual(2);
    expect(response.body[0].title).toEqual(TestPolygons[0].title);
    expect(response.body[0].polygon).toEqual(TestPolygons[0].polygon);
    expect(response.body[1].title).toEqual(TestPolygons[2].title);
    expect(response.body[1].polygon).toEqual(TestPolygons[2].polygon);
  });

  test('[GET] Получение ни одного полигона', async () => {
    const { longitude, latitude } = TestPoints['ne v home']
    const response = await supertest(app.server)
      .get(`/api/v1/delivery-zones?longitude=${longitude}&latitude=${latitude}`)
      .expect(200)
    expect(response.body).toEqual([]);
  });

  test('[GET] Получение ни одного полигона в вырезе полигона', async () => {
    const { longitude, latitude } = TestPoints['v hurule (nelzya)']
    const response = await supertest(app.server)
      .get(`/api/v1/delivery-zones?longitude=${longitude}&latitude=${latitude}`)
      .expect(200)
    expect(response.body).toEqual([]);
  });

  test('[GET/E] Получение полигонов без широты', async () => {
    const response = await supertest(app.server)
      .get('/api/v1/delivery-zones?longitude=44.30954107973196')
      .expect(400)
    expect(response.body.code).toEqual("FST_ERR_VALIDATION");
  });

  test('[GET/E] Получение полигонов без долготы', async () => {
    const response = await supertest(app.server)
      .get('/api/v1/delivery-zones?latitude=6.30242249835101')
      .expect(400)
    expect(response.body.code).toEqual("FST_ERR_VALIDATION");
  });

  test('[GET/E] Получение полигонов без долготы и широты', async () => {
    const response = await supertest(app.server)
      .get('/api/v1/delivery-zones')
      .expect(400)
    expect(response.body.code).toEqual("FST_ERR_VALIDATION");
  });
})




