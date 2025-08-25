//import { redis } from "../data-source";

export const getCache = async () => {
    //QRI  const data = await redis.get(key);
    //QRI  return data ? JSON.parse(data) : null;
    return null;
};

export const setCache = async (/*ttl: number = 3600*/) => {
    //QRI  await redis.set(key, JSON.stringify(value), "EX", ttl);
};

export const delCache = async () => {
    //QRI  await redis.del(key);
};
