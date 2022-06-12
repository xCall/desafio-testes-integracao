import { Connection } from "typeorm";
import createConnection from '../../../../database';
import request from 'supertest';
import { app } from '../../../../app';

let connection: Connection;

const user = {
  name: "carlos",
  email: "carlos@gmail.com",
  password: "1233456"
}

describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new deposit", async () => {
    await request(app).post('/api/v1/users').send(user);
    const loginUser = await request(app).post('/api/v1/sessions').send(user);
    const token = loginUser.body.token;

    const statement = await request(app).post('/api/v1/statements/deposit').send({
      amount: 150.00,
      description: "Deposit teste"
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(statement.statusCode).toBe(201);
  });


});
