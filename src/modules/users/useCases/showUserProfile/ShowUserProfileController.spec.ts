import createConnection from "../../../../database";
import { Connection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { AppError } from "../../../../shared/errors/AppError";

let connection: Connection;

describe("Show Profile", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show a user profile", async () => {
    await request(app).post('/api/v1/users').send({
      name: "test",
      email: "test@example.com",
      password: "123456"
    });
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: "test@example.com",
      password: "123456"
    });

    const { token } = responseToken.body;
    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(200);
  });

  it("should not able to show a profile of a non-exists user", async () => {

    await request(app).post('/api/v1/users').send({
      name: "test",
      email: "test@example.com",
      password: "123456"
    });
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: "jjjjjj@example.com",
      password: "123456"
    });

    const { token } = responseToken.body;
    const result = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer ${token}`
    });

    expect(result.statusCode).toBe(401);
  });
});

