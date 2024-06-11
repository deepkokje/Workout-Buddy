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
    console.log('requested key', `${req.path}@${hash.sha1(reqDataToHash)}`);
    return `${req.path}@${hash.sha1(reqDataToHash)}`;
  }
  function isRedisWorking() {
    return !!redisClient?.isOpen;
  }

  async function writeData(key, data, options) {
    if (isRedisWorking) {
      try {
        await redisClient.set(key, data, options);
      } catch (e) {
        console.error(`Failed to cache data for key=${key}`, e);
      }
    }
  }

  async function readData(key) {
    let cachedValue = undefined;
  
    if (isRedisWorking()) {
      // try to get the cached response from redis
      cachedValue = await redisClient.get(key);
      if (cachedValue) {
          return cachedValue;
      }
    }
  }

  const redisCacheMiddleWare = ({
    options = {
      EX: 21600 //6hrs
    }
  }) => {
    return async(req, res, next) => {
      if(isRedisWorking) {
        const key = requestToKey(req); //reads data if exists in redis db
        //check if key exists and find the data from redis and return it
        const cachedValue = await readData(key);
        if(cachedValue) {
          console.log('REDIS MATHI LAYO');
          try {
            return res.json(JSON.parse(cachedValue))
          } catch(e) {
            return res.send(cachedValue);
          }
        } else {
          console.log('DB MA SODHVA GAYO');
          //write logic for getting valeus from db and storing it in redis DB
          const oldSend = res.send;
          res.send = (data) => {
            res.send = oldSend;
            // cache the response only if it is successful
            if (res.statusCode.toString().startsWith("2")) {
             console.log('write data', {key,data});
              writeData(key, data, options).then();
            }
  
            return res.send(data);
          }
                next();
        }
      } else {
        next();
      }
    }

  } 



  module.exports = {initializeRedisClient, redisCacheMiddleWare};