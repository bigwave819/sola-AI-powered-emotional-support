import { JwtService } from '@nestjs/jwt';
import { db } from '../../src/db/client';
import { users } from '../../src/db/schema/users';

const jwt = new JwtService();

export async function createTestUser(emailPrefix: string) {
  const [user] = await db
    .insert(users)
    .values({
      email: `${emailPrefix}-${Date.now()}@test.sola`,
      authProvider: 'email',
      ageConfirmed: true,
    })
    .returning();

  const accessToken = jwt.sign(
    { sub: user.id },
    { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' },
  );

  return { user, accessToken };
}

export async function cleanupTestUser(userId: string) {
  await db.delete(users).where((u: any) => u.id === userId);
}