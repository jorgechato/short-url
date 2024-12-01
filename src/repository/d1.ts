import type { Bindings } from '@/env.d';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';

export function db(c: Context<{ Bindings: Bindings }>): DrizzleD1Database {
  return drizzle(
    c.env.DB,
  );
}
