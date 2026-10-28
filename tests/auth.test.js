const request = require("supertest");
const app = require("../src/app");

describe("Authentication API", () => {
  test("rejects login with missing credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({});

    expect(response.status).toBe(400);
  });

  test("rejects invalid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "invalid@example.com",
        password: "WrongPassword123!"
      });

    expect([400, 401]).toContain(response.status);
  });
});
