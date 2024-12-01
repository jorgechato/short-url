import type { Config } from 'drizzle-kit';

export default {
  schema: 'src/models/shortUrl.ts',
  out: 'db/migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  tablesFilter: ['/^(?!.*_cf_KV).*$/'], // Due to a bug in drizzle-kit: https://x.jrg.tools/ohDdDb
  dbCredentials: {
    accountId: process.env.ACCOUNT_ID!,
    databaseId: process.env.DATABASE_ID!,
    token: process.env.DATABASE_TOKEN!,
  },
} satisfies Config;
