import createConnection from '../../../../database';
import { Connection } from "typeorm";
import { hash } from 'bcryptjs';
import request from 'supertest';
import { v4 as uuidV4 } from 'uuid';
import { app } from '../../../../app';
import { UsersRepository } from '../../repositories/UsersRepository';
import { verify } from 'jsonwebtoken';

import authConfig from '../../../../config/auth';


let connection: Connection;

describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    const id = uuidV4();
    const password = await hash('123456', 8);

    console.log(id);
    console.log(password);

    await connection.query(`
      INSERT INTO users(id, name, email, password, created_at, updated_at)
      VALUES('${id}', 'teste', 'test@example.com', '${password}', 'now()', 'now()')
    `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate a user", async () => {
    const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "test@example.com",
        password: "123456"
      });

    const token = response.body;
    console.log(token);

    console.log(response.status);

    expect(response.status).toBe(200);
    // expect(response.body).toEqual({
    //   user: {
    //     id: user.id,
    //     name: user.name,
    //     email: user.email
    //   },
    //   token: expect.any(String)
    // });

    // expect(() => {
    //   verify(response.body.token, authConfig.jwt.secret);
    // }).not.toThrowError();
  });
});
