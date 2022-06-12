// it("should be able to list all operations", async () => {
//   await request(app).post('/api/v1/users').send(user);
//   const loginUser = await request(app).post('/api/v1/sessions').send(user);
//   const token = loginUser.body.token;

//   const balance = await request(app).get('/api/v1/balance').set({
//     Authorization: `Bearer ${token}`
//   });
//   console.log(balance);
//   expect(balance).toHaveProperty("balance");
// });
