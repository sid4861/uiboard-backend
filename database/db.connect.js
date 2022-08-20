const mongoose = require("mongoose");

function initializeDatabase() {
  mongoose.connect(`${process.env.DATABASE_URL}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true
  })
    .then(() => {
      console.log("connected to db");
    })
    .catch((err) => {
      console.log("error while connecting ", err);
    })
}

module.exports = initializeDatabase;