import client from "~/databases/redis.database";
import { InternalServerError } from "~/responses/error";

class RedisService {
  static async set(key: string, data: any, config: any = {}) {
    const value = JSON.stringify(data);

    try {
      await client.set(key, value, config);
    } catch (error) {
      throw new InternalServerError("[Redis] :: Error while saving cache!");
    }
  }

  static async get(key: string) {
    try {
      return await client.get(key);
    } catch (error) {
      throw new InternalServerError(`[Redis] :: Error when retrieving data from cache with key ${key}!`);
    }
  }

  static async del(keys: string[]) {
    keys.forEach(async (key) => {
      try {
        await client.del(key);
      } catch (error) {
        throw new InternalServerError(`[Redis] :: Error when deleting data from cache with key ${key}!`);
      }
    });
  }
}

export default RedisService;
