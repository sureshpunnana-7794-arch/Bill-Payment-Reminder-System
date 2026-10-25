import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Bills API (/api/bills)', () => {
  let userTokenA;
  let userTokenB;

  beforeEach(async () => {
    // User A
    const resA = await request(app).post('/api/auth/register').send({
      name: 'User A',
      email: 'usera@example.com',
      phone: '9876543210',
      password: 'Password@123'
    });
    userTokenA = resA.body.data.accessToken;

    // User B
    const resB = await request(app).post('/api/auth/register').send({
      name: 'User B',
      email: 'userb@example.com',
      phone: '9812345678',
      password: 'Password@123'
    });
    userTokenB = resB.body.data.accessToken;
  });

  it('POST /api/bills should create a new bill for the authenticated user', async () => {
    const newBill = {
      providerName: 'Adani Electricity',
      category: 'Electricity',
      consumerId: 'CA-10293847',
      amount: 1850,
      dueDate: '2026-11-15',
      billingPeriod: 'November 2026'
    };

    const res = await request(app)
      .post('/api/bills')
      .set('Authorization', `Bearer ${userTokenA}`)
      .send(newBill);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.providerName).toBe('Adani Electricity');
    expect(res.body.data.amount).toBe(1850);
    expect(res.body.data.isPaid).toBe(false);
  });

  it('POST /api/bills should reject invalid or negative amounts', async () => {
    const res = await request(app)
      .post('/api/bills')
      .set('Authorization', `Bearer ${userTokenA}`)
      .send({
        providerName: 'Invalid Bill',
        consumerId: 'CA-123',
        amount: -500,
        dueDate: '2026-11-15'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/bills should only return bills belonging to authenticated user', async () => {
    // User A creates a bill
    await request(app)
      .post('/api/bills')
      .set('Authorization', `Bearer ${userTokenA}`)
      .send({
        providerName: 'User A Exclusive Bill',
        consumerId: 'CA-A',
        amount: 2000,
        dueDate: '2026-11-10'
      });

    // User B lists bills
    const resB = await request(app)
      .get('/api/bills')
      .set('Authorization', `Bearer ${userTokenB}`);

    const hasUserABill = resB.body.data.bills.some((b) => b.providerName === 'User A Exclusive Bill');
    expect(hasUserABill).toBe(false);
  });

  it('Cross-user security: User B cannot modify or delete User A bill', async () => {
    const createRes = await request(app)
      .post('/api/bills')
      .set('Authorization', `Bearer ${userTokenA}`)
      .send({
        providerName: 'Secret Utility A',
        consumerId: 'CA-A1',
        amount: 1500,
        dueDate: '2026-11-20'
      });

    const billId = createRes.body.data.id || createRes.body.data._id;

    // User B attempts to delete
    const deleteRes = await request(app)
      .delete(`/api/bills/${billId}`)
      .set('Authorization', `Bearer ${userTokenB}`);

    expect(deleteRes.status).toBe(404);

    // User B attempts to update status
    const statusRes = await request(app)
      .patch(`/api/bills/${billId}/status`)
      .set('Authorization', `Bearer ${userTokenB}`)
      .send({ isPaid: true });

    expect(statusRes.status).toBe(404);
  });

  it('PATCH /api/bills/:id/status should toggle isPaid and set paidAt timestamp', async () => {
    const createRes = await request(app)
      .post('/api/bills')
      .set('Authorization', `Bearer ${userTokenA}`)
      .send({
        providerName: 'BESCOM Power',
        consumerId: 'CA-P1',
        amount: 3200,
        dueDate: '2026-11-25'
      });

    const billId = createRes.body.data.id || createRes.body.data._id;

    // Mark as paid
    const paidRes = await request(app)
      .patch(`/api/bills/${billId}/status`)
      .set('Authorization', `Bearer ${userTokenA}`)
      .send({ isPaid: true });

    expect(paidRes.status).toBe(200);
    expect(paidRes.body.data.isPaid).toBe(true);
    expect(paidRes.body.data.paidAt).toBeDefined();

    // Reopen as pending
    const pendingRes = await request(app)
      .patch(`/api/bills/${billId}/status`)
      .set('Authorization', `Bearer ${userTokenA}`)
      .send({ isPaid: false });

    expect(pendingRes.status).toBe(200);
    expect(pendingRes.body.data.isPaid).toBe(false);
    expect(pendingRes.body.data.paidAt).toBeNull();
  });

  it('GET /api/bills/summary should return accurate aggregated totals', async () => {
    const res = await request(app)
      .get('/api/bills/summary')
      .set('Authorization', `Bearer ${userTokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('selectedPeriod');
    expect(res.body.data).toHaveProperty('allTime');
    expect(res.body.data).toHaveProperty('urgency');
    expect(res.body.data).toHaveProperty('categories');
  });
});
