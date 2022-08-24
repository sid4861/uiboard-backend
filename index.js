const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const initializeDatabase = require("./database/db.connect.js");

const waitlistRouter = require("./routes/waitlist.route.js");
const userRouter = require("./routes/user.route.js")

const port = process.env.port || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


initializeDatabase();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, Authorization, X-Requested-With");

  if (req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Methods", 'GET, POST, PUT, PATCH, DELETE');
    res.status(200).json({});
  }

  next();

});

app.use("/waitlist", waitlistRouter);
app.use("/user", userRouter);

app.get("/", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hi!"
  });
});

app.use((req, res, next) => {
  const error = new Error("route not found");
  error.status = 401;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    success: false,
    message: error.message
  });
});

app.listen(port, () => {
  console.log("server running");
});