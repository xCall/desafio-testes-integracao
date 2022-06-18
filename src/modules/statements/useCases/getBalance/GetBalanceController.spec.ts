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

describe("Create Balance", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to list all operations", async () => {
    await request(app).post('/api/v1/users').send(user);
    const loginUser = await request(app).post('/api/v1/sessions').send(user);
    const { token } = loginUser.body;

    const balance = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${token}`
    });

    expect(balance.body).toHaveProperty("balance");
  });
});


