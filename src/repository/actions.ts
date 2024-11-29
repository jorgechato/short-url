import type { Bindings } from '@/env.d';
import type { ShortUrl, ThinShortUrl } from '@/models/shortUrl.d';
import type { SQL } from 'drizzle-orm';
import type { Context } from 'hono';
import { shortUrl } from '@/models/shortUrl';
import { db } from '@/repository/turso';
import { generateAlias } from '@/utils/crypto';
import { eq, or, sql } from 'drizzle-orm';

export async function getOriginUrlByAlias(ctx: Context<{ Bindings: Bindings }>, alias: string): Promise<{ error: unknown; origin: string }> {
  let res: ShortUrl[] = [];
  try {
    res = await db(ctx)
      .select()
      .from(shortUrl)
      .where(eq(shortUrl.Alias, alias));
  }
  catch (e) {
    return {
      error: e,
      origin: '',
    };
  }

  return {
    error: null,
    origin: res[0].Origin,
  };
}

export async function createShortUrl(ctx: Context<{ Bindings: Bindings }>, origin: string): Promise<{ error: unknown; res: ThinShortUrl }> {
  let res: ShortUrl[] = [];
  try {
    res = await db(ctx)
      .insert(shortUrl)
      .values({ Origin: origin, Alias: generateAlias(origin, ctx.env.PRIVATE_KEY!) })
      .returning();
  }
  catch (e) {
    return {
      error: e,
      res: {} as ThinShortUrl,
    };
  }

  return {
    error: null,
    res: {
      Alias: res[0].Alias,
      Origin: res[0].Origin,
    } as ThinShortUrl,
  };
}

export async function deleteShortUrl(ctx: Context<{ Bindings: Bindings }>, alias: string): Promise<{ error: unknown }> {
  try {
    await db(ctx)
      .delete(shortUrl)
      .where(eq(shortUrl.Alias, alias));
  }
  catch (e) {
    return {
      error: e,
    };
  }

  return {
    error: null,
  };
}

export async function searchShortUrl(ctx: Context<{ Bindings: Bindings }>, query: string): Promise<{ error: unknown; list: ShortUrl[] }> {
  let res: ShortUrl[] = [];

  const filters: SQL[] = [];
  filters.push(sql`LOWER(${shortUrl.Origin}) LIKE LOWER('%${query}%')`); // if query is a substring of origin
  filters.push(sql`LOWER(${shortUrl.Alias}) LIKE LOWER('%${query}%')`); // if query is a substring of alias

  try {
    res = await db(ctx)
      .select()
      .from(shortUrl)
      .where(or(...filters));
  }
  catch (e) {
    return {
      error: e,
      list: [],
    };
  }

  return {
    error: null,
    list: res,
  };
}
