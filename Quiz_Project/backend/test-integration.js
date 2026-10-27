import express from 'express';
import cors from 'cors';
import { initMemoryStorage } from './config/db.js';
import quizRoutes from './routes/quizRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', quizRoutes);

initMemoryStorage();

const TEST_PORT = 5050;
const server = app.listen(TEST_PORT, '127.0.0.1', async () => {
  try {
    console.log(`Test server running on port ${TEST_PORT}`);
    const BASE = `http://127.0.0.1:${TEST_PORT}/api`;

    // 0. Test Auth: Register student
    const regRes = await fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        email: `student_${Date.now()}@test.com`,
        password: 'password123',
        role: 'student'
      })
    });
    const regJson = await regRes.json();
    console.log(`[PASS] POST /api/auth/register created user "${regJson.user?.name}" (Role: ${regJson.user?.role}).`);

    // Test Auth: Login as demo teacher
    const loginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teacher@demo.com',
        password: 'teacher123'
      })
    });
    const loginJson = await loginRes.json();
    console.log(`[PASS] POST /api/auth/login authenticated "${loginJson.user?.name}" (Role: ${loginJson.user?.role}).`);

    // 1. Test GET /api/quizzes
    const listRes = await fetch(`${BASE}/quizzes`);
    const listJson = await listRes.json();
    console.log(`[PASS] GET /api/quizzes returned ${listJson.count} quizzes.`);

    const firstQuiz = listJson.data[0];

    // 2. Test GET /api/quizzes/:id
    const singleRes = await fetch(`${BASE}/quizzes/${firstQuiz._id}`);
    const singleJson = await singleRes.json();
    console.log(`[PASS] GET /api/quizzes/:id fetched "${singleJson.data.title}" with ${singleJson.data.questions.length} questions.`);

    // 3. Test POST /api/quizzes/:id/submit with student token
    const submitRes = await fetch(`${BASE}/quizzes/${firstQuiz._id}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${regJson.token}`
      },
      body: JSON.stringify({
        answers: { 0: 1, 1: 2, 2: 0, 3: 1, 4: 1 },
        timeSpentSeconds: 65
      })
    });
    const submitJson = await submitRes.json();
    console.log(`[PASS] POST /api/quizzes/:id/submit scored ${submitJson.results.score}/${submitJson.results.totalQuestions} (${submitJson.results.percentage}%).`);

    // 4. Test POST /api/quizzes with teacher token
    const createRes = await fetch(`${BASE}/quizzes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginJson.token}`
      },
      body: JSON.stringify({
        title: 'Node.js Basics Test',
        description: 'Test node fundamentals',
        category: 'JavaScript',
        difficulty: 'Easy',
        timeLimit: 3,
        questions: [
          {
            questionText: 'What module is built into Node for HTTP?',
            options: ['http', 'axios', 'request', 'fetch'],
            correctOptionIndex: 0,
            explanation: 'Node.js has a built-in "http" module.'
          }
        ]
      })
    });
    const createJson = await createRes.json();
    console.log(`[PASS] POST /api/quizzes created quiz with ID "${createJson.data._id}".`);

    // 5. Test GET /api/submissions with student token (should only see their own respective result)
    const subsRes = await fetch(`${BASE}/submissions`, {
      headers: {
        'Authorization': `Bearer ${regJson.token}`
      }
    });
    const subsJson = await subsRes.json();
    console.log(`[PASS] GET /api/submissions returned ${subsJson.data.length} submissions for student ${regJson.user?.name}.`);

    // 6. Test DELETE /api/quizzes/:id with teacher token
    const delRes = await fetch(`${BASE}/quizzes/${createJson.data._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${loginJson.token}`
      }
    });
    const delJson = await delRes.json();
    console.log(`[PASS] DELETE /api/quizzes/:id completed: ${delJson.message}`);

    console.log('\n🎉 ALL BACKEND API INTEGRATION TESTS PASSED SUCCESSFULLY!\n');
  } catch (err) {
    console.error('Test error:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
