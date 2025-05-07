const mongoose = require("mongoose");
const initData = require("./init.js");
const Listing = require("../models/Listing.js");

const MONGO_URL = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  // await Listing.deleteMany({});

  initData.data = initData.data.map((obj)=>({
    ...obj,
    owner : "68177d620a179a0a4d67aa3b",
  }))

  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();