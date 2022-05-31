import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;
/**
 *
 *
 *
 *  Refaça o teste, vc nao tem que criar o usuario no
 *  before pois vc precisa criar um usario no it
 *
 *
 */






describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash('1234', 8);

    await connection.query(`
      INSERT INTO users
        (id, name, email, password, create_at, updated_at)
      VALUES
      ('${id}','carlos','carlos@carlos.com.br','${password}','now()','now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate a user", async () => {
    const response = await request(app).post('/api/v1/users').send({
      email: "carlos@carlos.com.br",
      password: "1234",
    });

    expect(response.status).toBe(201);
  });
});
