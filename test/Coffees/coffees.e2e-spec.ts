import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from '../src/app.module';
import { CoffeesModule } from '../../src/coffees/coffees.module';

describe('[Feature] Coffees - /coffees', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoffeesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.todo('Create [Post /]');
  it.todo('Get all [Get /]');
  it.todo('Get one [Get /:id]');
  it.todo('Update one [Patch /:id]');
  it.todo('Delete oen [Delete /:id]');

  // afterAll(async () => {
  //   await app.close();
  // });
});
