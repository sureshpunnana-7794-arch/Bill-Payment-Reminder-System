import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Reminders & Notifications API', () => {
  let userToken;
  let testBillId;

  beforeEach(async () => {
    const authRes = await request(app).post('/api/auth/register').send({
      name: 'Reminder Tester',
      email: 'remindertester@example.com',
      phone: '9876543210',
      password: 'Password@123'
    });
    userToken = authRes.body.data.accessToken;

    const billRes = await request(app)
      .post('/api/bills')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        providerName: 'Airtel Broadband',
        category: 'Broadband',
        consumerId: 'BB-9871',
        amount: 1199,
        dueDate: '2026-11-28'
      });

    testBillId = billRes.body.data.id || billRes.body.data._id;
  });

  it('POST /api/reminders should configure channels and schedules', async () => {
    const res = await request(app)
      .post('/api/reminders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        billId: testBillId,
        autoRemind: true,
        reminderChannels: { whatsapp: true, sms: false, push: true },
        schedule: { sevenDays: true, threeDays: true, oneDay: false, dueDay: true }
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reminderChannels.sms).toBe(false);
  });

  it('GET /api/notifications should return activity history', async () => {
    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('PATCH /api/notifications/read-all should mark all notifications as read', async () => {
    const res = await request(app)
      .patch('/api/notifications/read-all')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const checkRes = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${userToken}`);

    const hasUnread = checkRes.body.data.some((n) => !n.read);
    expect(hasUnread).toBe(false);
  });
});
