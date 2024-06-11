require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/user");
const { initializeRedisClient, redisCacheMiddleWare } = require("./middleware/redis");


async function initializeExpressServer() {
// express app
const app = express();
// middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//connect to redis
await initializeRedisClient();

// routes
app.use("/api/workouts", redisCacheMiddleWare({
  options: {
    EX: 43200, // 12h
    NX: false, // write the data even if the key already exists
  },
}),workoutRoutes);
app.use("/api/user", userRoutes);

// connect to db
// process is a global obj in node environment, much like document global obj browser environment
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "mernapp2",
  })
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log(
        "conneted to db & listening on port " +
          process.env.PORT
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
}

  initializeExpressServer()
  .then()
  .catch((e) => console.error(e));
