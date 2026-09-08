import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { createTestUser } from './helpers/test-auth';
import { db } from '../src/db/client';
import { users } from '../src/db/schema/users';
import { eq } from 'drizzle-orm';

jest.setTimeout(60000);

describe('Auth isolation (User A cannot access User B data)', () => {
  let app: INestApplication;
  let userA: Awaited<ReturnType<typeof createTestUser>>;
  let userB: Awaited<ReturnType<typeof createTestUser>>;
  let userAJournalEntryId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();

    userA = await createTestUser('user-a');
    userB = await createTestUser('user-b');

    // User A creates a journal entry
    const res = await request(app.getHttpServer())
      .post('/journal')
      .set('Authorization', `Bearer ${userA.accessToken}`);
    userAJournalEntryId = res.body.id;
  });

  afterAll(async () => {
    await db.delete(users).where(eq(users.id, userA.user.id));
    await db.delete(users).where(eq(users.id, userB.user.id));
    await app.close();
  });

  it("rejects User B reading User A's journal entry", async () => {
    const res = await request(app.getHttpServer())
      .get(`/journal/${userAJournalEntryId}`)
      .set('Authorization', `Bearer ${userB.accessToken}`);
    expect(res.status).toBe(403);
  });

  it("rejects User B updating User A's journal entry", async () => {
    const res = await request(app.getHttpServer())
      .patch(`/journal/${userAJournalEntryId}`)
      .set('Authorization', `Bearer ${userB.accessToken}`)
      .send({ body: 'hacked' });
    expect(res.status).toBe(403);
  });

  it("rejects User B deleting User A's journal entry", async () => {
    const res = await request(app.getHttpServer())
      .delete(`/journal/${userAJournalEntryId}`)
      .set('Authorization', `Bearer ${userB.accessToken}`);
    expect(res.status).toBe(403);
  });

  it("rejects User B requesting reflection on User A's entry", async () => {
    const res = await request(app.getHttpServer())
      .post(`/journal/${userAJournalEntryId}/reflect`)
      .set('Authorization', `Bearer ${userB.accessToken}`);
    expect(res.status).toBe(403);
  });

  it("User A's own home summary never contains User B's data", async () => {
    const res = await request(app.getHttpServer())
      .get('/home/summary')
      .set('Authorization', `Bearer ${userA.accessToken}`);
    expect(res.status).toBe(200);
    // Nothing in the response should reference userB's id anywhere
    expect(JSON.stringify(res.body)).not.toContain(userB.user.id);
  });

  it('rejects requests with no token at all', async () => {
    const res = await request(app.getHttpServer()).get(`/journal/${userAJournalEntryId}`);
    expect(res.status).toBe(401);
  });

  it('rejects requests with a malformed/garbage token', async () => {
    const res = await request(app.getHttpServer())
      .get(`/journal/${userAJournalEntryId}`)
      .set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });
});