const {createClient} = require('redis');
const hash = require('object-hash');
let redisClient = undefined;

async function initializeRedisClient() {
    // read the Redis connection URL from the envs
    let redisURL = process.env.REDIS_URI;
    if (redisURL) {
      // create the Redis client object
      redisClient = createClient({ url: redisURL }).on("error", (e) => {
        console.error(`Failed to create the Redis client with error:`);
        console.error(e);
      });
  
      try {
        // connect to the Redis server
        await redisClient.connect();
        console.log(`Connected to Redis successfully!`);
      } catch (e) {
        console.error(`Connection to Redis failed with error:`);
        console.error(e);
      }
    }
  }
  function requestToKey(req) {
    const reqDataToHash = {
      query: req.query,
      body: req.body,
    };
    return `${req.path}@${hash.sha1(reqDataToHash)}`;
  }
  function isRedisWorking() {
    return !!redisClient?.isOpen;
  }

  async function writeData(key, data, options) {
    if (isRedisWorking()) {
      try {
        await redisClient.set(key, data, options);
      } catch (e) {
        console.error(`Failed to cache data for key=${key}`, e);
      }
    }
  }

  async function readData(key) {
    let cachedValue = undefined;
  
    // try to get the cached response from redis
    if (isRedisWorking()) {
      cachedValue = await redisClient.get(key);
      console.log('cachedValue',cachedValue);
      if (cachedValue) {
          return cachedValue;
      }
    }
  }

  function redisCacheMiddleWare(
    options = {
      EX: 21600, // 6h
    }
  ) {
    return async (req, res, next) => {
      if (isRedisWorking()) {
        const key = requestToKey(req);
        // if there is some cached data, retrieve it and return it
        const cachedValue = await readData(key);
        if (cachedValue) {
          try {
            return res.json(JSON.parse(cachedValue));
          } catch {
            return res.send(cachedValue);
          }
        } else {
          const oldSend = res.send;
          res.send = function (data) {
            res.send = oldSend;
            if (res.statusCode.toString().startsWith("2")) {
              writeData(key, data, options).then();
            }
  
            return res.send(data);
          };
  
          // continue to the controller function
          next();
        }
      } else {
        // proceed with no caching
        next();
      }
    };
  }


  module.exports = {initializeRedisClient, redisCacheMiddleWare};