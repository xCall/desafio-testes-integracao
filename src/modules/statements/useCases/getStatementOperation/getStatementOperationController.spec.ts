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
const operation = {
  amount: 175.90,
  description: "description",
}

describe("List Deposit or Withdraw", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able list deposit or withdraw", async () => {
    await request(app).post('/api/v1/users').send(user);
    const loginUser = await request(app).post('/api/v1/sessions').send(user);
    const { token } = loginUser.body;

    const deposit = await request(app).post('/api/v1/statements/deposit')
    .send(operation)
    .set({
      Authorization: `Bearer ${token}`
    });
    const withdraw = await request(app).post('/api/v1/statements/withdraw')
    .send(operation)
    .set({
      Authorization: `Bearer ${token}`
    });
    const operationDeposit = await request(app)
    .get(`/api/v1/statements/${deposit.body.id}`)
    .set({
      Authorization: `Bearer ${token}`
    });
    const operationsWithdraw = await request(app)
    .get(`/api/v1/statements/${withdraw.body.id}`)
    .set({
      Authorization: `Bearer ${token}`
    });

    expect(operationDeposit.statusCode).toBe(200);
    expect(operationDeposit.body.id).toBe(deposit.body.id);
    expect(operationDeposit.body).toHaveProperty("created_at");
    expect(operationDeposit.body).toHaveProperty("updated_at");

    expect(operationsWithdraw.statusCode).toBe(200);
    expect(operationsWithdraw.body.id).toBe(withdraw.body.id);
    expect(operationsWithdraw.body).toHaveProperty("created_at");
    expect(operationsWithdraw.body).toHaveProperty("updated_at");
  });
});
