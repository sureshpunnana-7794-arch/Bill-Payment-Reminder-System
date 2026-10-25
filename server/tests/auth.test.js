import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { User } from '../src/models/User.js';

describe('Auth API (/api/auth)', () => {
  const testUser = {
    name: 'Suresh Punnana',
    email: 'suresh.test@example.com',
    phone: '9876543210',
    password: 'SecurePassword123'
  };

  it('POST /register should register user, hash password, and return tokens', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
    expect(res.body.data.user).not.toHaveProperty('password');
    expect(res.body.data.accessToken).toBeDefined();

    // Verify password is encrypted in database
    const dbUser = await User.findOne({ email: testUser.email.toLowerCase() }).select('+password');
    expect(dbUser.password).not.toBe(testUser.password);
    expect(dbUser.password.startsWith('$2')).toBe(true); // bcrypt hash
  });

  it('POST /register should reject duplicate email address with 409', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('POST /register should reject invalid email format or short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'A',
      email: 'not-an-email',
      phone: '123',
      password: '123'
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('POST /login should authenticate valid credentials', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.name).toBe(testUser.name);
  });

  it('POST /login should reject incorrect password with 401', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'WrongPassword'
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /me should return authenticated user profile', async () => {
    const regRes = await request(app).post('/api/auth/register').send(testUser);
    const token = regRes.body.data.accessToken;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.email).toBe(testUser.email.toLowerCase());
  });

  it('GET /me should deny access without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('POST /refresh should rotate refresh token and issue new access token', async () => {
    const regRes = await request(app).post('/api/auth/register').send(testUser);
    const refreshToken = regRes.body.data.refreshToken;

    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.data.accessToken).toBeDefined();
  });

  it('POST /demo-login should log in as preset user with seeded bills', async () => {
    const res = await request(app).post('/api/auth/demo-login').send({
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '9876543210'
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.name).toBe('Rahul Sharma');
    expect(res.body.data.accessToken).toBeDefined();
  });
});
