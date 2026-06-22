import { Redis } from "@upstash/redis";

const UNIQUE_SET = "portfolio:visitor-ids";
const TOTAL_VIEWS = "portfolio:page-views";

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function isVisitorStoreConfigured(): boolean {
  return getRedis() !== null;
}

export type VisitorCounts = {
  unique: number;
  total: number;
  configured: boolean;
};

export async function getVisitorCounts(): Promise<VisitorCounts> {
  const redis = getRedis();
  if (!redis) {
    return { unique: 0, total: 0, configured: false };
  }

  const [unique, total] = await Promise.all([
    redis.scard(UNIQUE_SET),
    redis.get<number>(TOTAL_VIEWS),
  ]);

  return {
    unique: unique ?? 0,
    total: total ?? 0,
    configured: true,
  };
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidVisitorId(id: string): boolean {
  return UUID_RE.test(id);
}

export async function recordVisit(visitorId: string): Promise<VisitorCounts> {
  const redis = getRedis();
  if (!redis) {
    return { unique: 0, total: 0, configured: false };
  }

  const pipeline = redis.pipeline();
  pipeline.sadd(UNIQUE_SET, visitorId);
  pipeline.incr(TOTAL_VIEWS);
  await pipeline.exec();

  return getVisitorCounts();
}
