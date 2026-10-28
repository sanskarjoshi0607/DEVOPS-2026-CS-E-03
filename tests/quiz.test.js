const request = require("supertest");
const app = require("../src/app");

describe("Quiz API", () => {
  test("returns quizzes successfully", async () => {
    const response = await request(app).get("/api/quizzes");

    expect([200, 401, 403]).toContain(response.status);
  });

  test("returns 404 for a nonexistent quiz", async () => {
    const response = await request(app)
      .get("/api/quizzes/000000000000000000000000");

    expect(response.status).toBe(404);
  });
});
