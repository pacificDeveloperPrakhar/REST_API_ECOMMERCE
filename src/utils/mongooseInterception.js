const redis = require("redis");
const client = redis.createClient();
client.connect().catch((err) => {
  throw err;
});
const mongoose = require("mongoose");
const exec = mongoose.Query.prototype.exec;
mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    console.log("no caching has been done");
    return exec.apply(this, arguments);
  }
  const key = JSON.stringify(
    Object.assign(this._conditions, { model: this.mongooseCollection.name })
  );

  let data = JSON.parse(await client.hGet(this.cacheKey, key));
  console.log("executed the file");
  if (!data) {
//     console.log("cached the query into the database onto this hardware memory");
// console.log(this)
    data = exec.apply(this, arguments);
    // console.log(await data);
    console.log(await data);
    // client.hSet(cacheKey, key, JSON.stringify(await data), {"EX": 5});
    return data;
  }

  return Array.isArray(data)
    ? data.map((data) => {
        return new this.model(data);
      })
    : new this.model(data);
};

mongoose.Query.prototype.cache = async function (key) {

  return this;
};
