import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { createTestUser } from './helpers/test-auth';
import { SAFETY_TRIGGER_PHRASE } from '../src/ai/fake.provider';
import { db } from '../src/db/client';
import { users } from '../src/db/schema/users';
import { safetyEvents } from '../src/db/schema/safety';
import { eq } from 'drizzle-orm';

jest.setTimeout(60000);

describe('Safety trigger pipeline', () => {
  let app: INestApplication;
  let testUser: Awaited<ReturnType<typeof createTestUser>>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    testUser = await createTestUser('safety-test');
  });

  afterAll(async () => {
    await db.delete(users).where(eq(users.id, testUser.user.id));
    await app.close();
  });

  it('flags a message containing the trigger phrase and logs a metadata-only SafetyEvent', async () => {
    const create = await request(app.getHttpServer())
      .post('/journal')
      .set('Authorization', `Bearer ${testUser.accessToken}`);

    await request(app.getHttpServer())
      .patch(`/journal/${create.body.id}`)
      .set('Authorization', `Bearer ${testUser.accessToken}`)
      .send({ body: `I feel awful. ${SAFETY_TRIGGER_PHRASE}` });

    const reflect = await request(app.getHttpServer())
      .post(`/journal/${create.body.id}/reflect`)
      .set('Authorization', `Bearer ${testUser.accessToken}`);

    expect(reflect.status).toBe(201);
    expect(reflect.body.flaggedForSafety).toBe(true);

    const events = await db
      .select()
      .from(safetyEvents)
      .where(eq(safetyEvents.userId, testUser.user.id));

    expect(events.length).toBe(1);
    expect(events[0].context).toBe('journal_reflection');

    // The critical assertion: NO journal content anywhere in the logged row.
    const rowAsString = JSON.stringify(events[0]);
    expect(rowAsString).not.toContain(SAFETY_TRIGGER_PHRASE);
    expect(rowAsString).not.toContain('I feel awful');
  });

  it('does not flag or log an ordinary message', async () => {
    const create = await request(app.getHttpServer())
      .post('/journal')
      .set('Authorization', `Bearer ${testUser.accessToken}`);

    await request(app.getHttpServer())
      .patch(`/journal/${create.body.id}`)
      .set('Authorization', `Bearer ${testUser.accessToken}`)
      .send({ body: 'Today was a pretty good day overall.' });

    const reflect = await request(app.getHttpServer())
      .post(`/journal/${create.body.id}/reflect`)
      .set('Authorization', `Bearer ${testUser.accessToken}`);

    expect(reflect.body.flaggedForSafety).toBe(false);
  });
});