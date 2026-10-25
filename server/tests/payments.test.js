import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Payments API (/api/payments)', () => {
  let userToken;
  let testBillId;

  beforeEach(async () => {
    const authRes = await request(app).post('/api/auth/register').send({
      name: 'Pay Tester',
      email: 'paytester@example.com',
      phone: '9876543210',
      password: 'Password@123'
    });
    userToken = authRes.body.data.accessToken;

    const billRes = await request(app)
      .post('/api/bills')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        providerName: 'HDFC Bank Credit Card',
        category: 'CreditCard',
        consumerId: '•••• •••• •••• 1234',
        amount: 8450,
        dueDate: '2026-11-20'
      });

    testBillId = billRes.body.data.id || billRes.body.data._id;
  });

  it('POST /api/payments should authorize payment, mark bill paid, and return payment record', async () => {
    const res = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        billId: testBillId,
        paymentMethod: 'UPI',
        paymentDetails: { upiApp: 'gpay', isSimulated: true }
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.payment.transactionId).toBeDefined();
    expect(res.body.data.bill.isPaid).toBe(true);

    // Verify bill in database is updated
    const billRes = await request(app)
      .get(`/api/bills/${testBillId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(billRes.body.data.isPaid).toBe(true);
  });

  it('POST /api/payments should reject duplicate payment on already settled bill', async () => {
    // Pay first time
    await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ billId: testBillId, paymentMethod: 'UPI' });

    // Attempt second payment
    const duplicateRes = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ billId: testBillId, paymentMethod: 'UPI' });

    expect(duplicateRes.status).toBe(400);
    expect(duplicateRes.body.success).toBe(false);
  });

  it('GET /api/payments/:id/receipt should return certified receipt data', async () => {
    const payRes = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ billId: testBillId, paymentMethod: 'CARD' });

    const paymentId = payRes.body.data.payment._id || payRes.body.data.payment.id;

    const receiptRes = await request(app)
      .get(`/api/payments/${paymentId}/receipt`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(receiptRes.status).toBe(200);
    expect(receiptRes.body.success).toBe(true);
    expect(receiptRes.body.data.receiptNumber).toBeDefined();
    expect(receiptRes.body.data.amount).toBe(8450);
    expect(receiptRes.body.data.isBbpsCertified).toBe(true);
  });
});
