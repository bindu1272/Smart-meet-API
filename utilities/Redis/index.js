
const redis = require("redis");
const client = redis.createClient("redis://localhost:6379");
const GenericError = require('../../errors/GenericError')

class Redis {

    constructor() {}

    async set(data,key,time=3600) {
        if(!data || !key)
            throw new GenericError("Invalid caching paramertes");

        client.set(key, data,'EX',time);
    }

    async get(key) {

        if(!key)
            throw new GenericError("Invalid caching paramertes");

        return client.get(key);

    }

    async isExists (key) {
        return client.exists(key);
    }

}

module.exports = Redis;