const mongoose = require("mongoose");

const dbConfig = {
  uri: process.env.MONGO_URI || "mongodb://localhost:27017/shop",
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
  },
};

mongoose
  .connect(dbConfig.uri, dbConfig.options)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

module.exports = {
  mongoose,
  dbConfig,
};
