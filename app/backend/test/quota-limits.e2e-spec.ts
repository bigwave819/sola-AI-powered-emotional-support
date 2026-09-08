import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { createTestUser } from './helpers/test-auth';
import { db } from '../src/db/client';
import { users } from '../src/db/schema/users';
import { eq } from 'drizzle-orm';

jest.setTimeout(60000);

// Relies on .env.test setting FREE_TIER_AI_LIMIT=2, so this test doesn't
// need to create 20 real entries to hit the limit.

describe('AI reflection quota enforcement', () => {
  let app: INestApplication;
  let freeUser: Awaited<ReturnType<typeof createTestUser>>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    freeUser = await createTestUser('free-quota');
  });

  afterAll(async () => {
    await db.delete(users).where(eq(users.id, freeUser.user.id));
    await app.close();
  });

  async function createAndReflect() {
    const create = await request(app.getHttpServer())
      .post('/journal')
      .set('Authorization', `Bearer ${freeUser.accessToken}`);

    return request(app.getHttpServer())
      .post(`/journal/${create.body.id}/reflect`)
      .set('Authorization', `Bearer ${freeUser.accessToken}`);
  }

  it('allows reflections up to the Free tier limit (2, per .env.test)', async () => {
    const first = await createAndReflect();
    expect(first.status).toBe(201);

    const second = await createAndReflect();
    expect(second.status).toBe(201);
  });

  it('rejects the reflection that exceeds the limit with AI_QUOTA_EXCEEDED', async () => {
    const third = await createAndReflect();
    expect(third.status).toBe(403);
    expect(third.body.code).toBe('AI_QUOTA_EXCEEDED');
  });
});