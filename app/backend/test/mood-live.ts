import 'dotenv/config';
import { createTestUser, cleanupTestUser } from './helpers/test-auth';

async function main() {
  const base = 'http://localhost:3000';
  const { user, accessToken } = await createTestUser('mood-live');
  try {
    const post = await fetch(`${base}/mood`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ score: 7, tags: ['work'] }),
    });
    const created = await post.json();
    console.log('POST /mood status:', post.status, JSON.stringify(created));

    const get = await fetch(`${base}/mood/history`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const history = await get.json();
    const found = Array.isArray(history) && history.some((e: any) => e.id === created.id);
    console.log('GET /mood/history status:', get.status, 'count:', history.length, 'entryFound:', found);
  } finally {
    await cleanupTestUser(user.id);
  }
}
main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('FAILED:', e);
    process.exit(1);
  });
