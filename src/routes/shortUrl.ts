import type { Bindings } from '@/env.d';
import { getOriginUrlByAlias, increaseHits } from '@/repository/actions';
import { NotFound } from '@/routes/errors';
import { CACHE_REDIRECT } from '@/utils/constants';
import { aliasSchema } from '@/utils/validator';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { cache } from 'hono/cache';

const open = new Hono<{ Bindings: Bindings }>()

  .get('/:id', cache(CACHE_REDIRECT), zValidator('param', aliasSchema), async (c) => {
    const id: string = c.req.param('id');

    const { error, res } = await getOriginUrlByAlias(c, id);
    if (error || !res) {
      return c.json({ message: NotFound }, 400);
    }

    const { error: err } = await increaseHits(c, res.Alias, res.Hits);
    if (err) {
      return c.json({ message: NotFound }, 400);
    }

    return c.redirect(res.Origin);
  });

export default open;
