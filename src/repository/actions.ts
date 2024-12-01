import type { Bindings } from '@/env.d';
import type { ShortUrl, ThinShortUrl } from '@/models/shortUrl.d';
import type { SQL } from 'drizzle-orm';
import type { Context } from 'hono';
import { shortUrl } from '@/models/shortUrl';
import { db } from '@/repository/d1';
import { AlreadyExists } from '@/routes/errors';
import { generateAlias } from '@/utils/crypto';
import { eq, like, or } from 'drizzle-orm';

export async function getOriginUrlByAlias(ctx: Context<{ Bindings: Bindings }>, alias: string): Promise<{ error: unknown; res: ShortUrl | null }> {
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
      res: null,
    };
  }

  return {
    error: null,
    res: res[0],
  };
}

export async function createShortUrl(ctx: Context<{ Bindings: Bindings }>, origin: string): Promise<{ error: unknown; res: ThinShortUrl | null }> {
  const alias = generateAlias(origin, ctx.env.PRIVATE_KEY!);
  let res: ShortUrl[] = [];
  try {
    res = await db(ctx)
      .insert(shortUrl)
      .values({ Origin: origin, Alias: alias })
      .onConflictDoNothing()
      .returning();
  }
  catch (e) {
    return {
      error: e,
      res: null,
    };
  }

  if (res.length === 0) {
    return {
      error: AlreadyExists,
      res: {
        Alias: alias,
        Origin: origin,
      } as ThinShortUrl,
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
  filters.push(like(shortUrl.Origin, `%${query.toLowerCase()}%`)); // if query is a substring of origin
  filters.push(like(shortUrl.Alias, `%${query}%`)); // if query is a substring of alias

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

export async function increaseHits(ctx: Context<{ Bindings: Bindings }>, alias: string, hits: number): Promise<{ error: unknown }> {
  try {
    await db(ctx)
      .update(shortUrl)
      .set({ Hits: hits + 1 })
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
