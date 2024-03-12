import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCoffeeDto } from '../../src/coffees/dto/create-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    name: 'Old Florida Rmmoast',
    brand: 'Buddy Bretew',
    flavors: ['cecec', 'ekjmcjem  mkc'],
  };

  const coffee2 = {
    name: 'AlHoussam',
    brand: 'AlSayfe',
    flavors: ['Do', '7adayne'],
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        // For pagination Dto en desous
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  let coffeId: string = '';

  it('should be defined', () => {
    expect(1 + 1).toBeDefined();
  });

  it('Create Coffe1 [Post /]', () => {
    return request(app.getHttpServer())
      .post('/coffes')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.ACCEPTED)
      .then(({ body }) => {
        expect(body.name).toEqual(coffee.name);
        expect(body.brand).toEqual(coffee.brand);
        expect(Object.keys(body.flavors)).toHaveLength(coffee.flavors.length);
      });
  });

  it('Create Coffe2 [Post /]', () => {
    return request(app.getHttpServer())
      .post('/coffes')
      .send(coffee2 as CreateCoffeeDto)
      .expect(HttpStatus.ACCEPTED)
      .then(({ body }) => {
        expect(body.name).toEqual(coffee2.name);
        expect(body.brand).toEqual(coffee2.brand);
        expect(Object.keys(body.flavors)).toHaveLength(coffee2.flavors.length);
      });
  });

  it('Get all [Get /]', () => {
    return request(app.getHttpServer())
      .get('/coffes')
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toBeDefined();
        expect(body.length).toEqual(2);
        coffeId = body[1].id;
      });
  });
  it('Get one [Get /:id]', () => {
    return request(app.getHttpServer())
      .get(`/coffes/${coffeId}`)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toBeDefined();
        expect(body.length).toEqual(1);
        expect(body[0].id).toEqual(coffeId);
      });
  });
  it('Update one [Patch /:id]', () => {
    return request(app.getHttpServer())
      .patch(`/coffes/${coffeId}`)
      .send({
        ...coffee,
        name: 'Houssam Rajawi',
      })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toBeDefined();
        expect(body.id).toEqual(coffeId);
        expect(body.name).toEqual('Houssam Rajawi');
      });
  });
  it('Delete oen [Delete /:id]', () => {
    return request(app.getHttpServer())
      .delete(`/coffes/${coffeId}`)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toBeDefined();
        expect(body.length).toEqual(1);
        expect(body[0].name).toEqual('Houssam Rajawi');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
