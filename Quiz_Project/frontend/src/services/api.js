/**
 * Centralized API service for communicating with the Express backend
 * Includes authentication token handling and role-based request authorization.
 */

const API_BASE_URL = 'https://quizportal-backend-dbn6.onrender.com/api';
// Token Storage Helpers
export function getAuthToken() {
  return localStorage.getItem('quiz_auth_token');
}

export function setAuthToken(token) {
  localStorage.setItem('quiz_auth_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('quiz_auth_token');
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('quiz_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  localStorage.setItem('quiz_user', JSON.stringify(user));
}

export function removeStoredUser() {
  localStorage.removeItem('quiz_user');
}

// Build standard request headers with Authorization token if available
function getHeaders(contentType = 'application/json') {
  const headers = {};
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/* ==========================================================================
   AUTHENTICATION API CALLS
   ========================================================================== */

/**
 * Register a new user (Student or Teacher)
 */
export async function registerApi({ name, email, password, role = 'student' }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed.');
  }

  if (data.token) {
    setAuthToken(data.token);
    setStoredUser(data.user);
  }

  return data;
}

/**
 * Log in an existing user
 */
export async function loginApi({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed.');
  }

  if (data.token) {
    setAuthToken(data.token);
    setStoredUser(data.user);
  }

  return data;
}

/**
 * Fetch current authenticated user profile
 */
export async function getMeApi() {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    removeAuthToken();
    removeStoredUser();
    throw new Error('Session expired.');
  }

  return response.json();
}

/* ==========================================================================
   QUIZ & SUBMISSION API CALLS
   ========================================================================== */

/**
 * Fetch all quizzes with optional filter params (category, difficulty, search)
 */
export async function fetchQuizzes({ category = 'All', difficulty = 'All', search = '' } = {}) {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (difficulty && difficulty !== 'All') params.append('difficulty', difficulty);
  if (search) params.append('search', search);

  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`${API_BASE_URL}/quizzes${query}`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error(`Failed to load quizzes (${response.status})`);
  }

  return response.json();
}

/**
 * Fetch a single quiz by ID for taking the test
 */
export async function fetchQuizById(id) {
  const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error(`Failed to load quiz (${response.status})`);
  }

  return response.json();
}

/**
 * Submit answers to a quiz and receive graded results with explanations
 */
export async function submitQuizAnswers(id, submissionData) {
  const response = await fetch(`${API_BASE_URL}/quizzes/${id}/submit`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(submissionData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to submit quiz (${response.status})`);
  }

  return response.json();
}

/**
 * Create a new quiz (Teacher only)
 */
export async function createQuiz(quizData) {
  const response = await fetch(`${API_BASE_URL}/quizzes`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(quizData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create quiz (${response.status})`);
  }

  return response.json();
}

/**
 * Delete a quiz by ID (Teacher only)
 */
export async function deleteQuiz(id) {
  const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete quiz (${response.status})`);
  }

  return response.json();
}

/**
 * Fetch submissions / scoreboard (defaults to personal attempts, teachers can pass view='all')
 */
export async function fetchSubmissions({ mine = true, view = 'mine' } = {}) {
  const params = new URLSearchParams();
  if (mine) params.append('mine', 'true');
  if (view) params.append('view', view);

  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`${API_BASE_URL}/submissions${query}`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch submissions (${response.status})`);
  }

  return response.json();
}

/**
 * Fetch MongoDB connection status
 */
export async function fetchDbStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/status`);
    if (!response.ok) return { success: false, status: { isConnected: false } };
    return response.json();
  } catch {
    return { success: false, status: { isConnected: false, error: 'Cannot connect to backend server' } };
  }
}
