const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var cors = require("cors");

const HttpError = require("./models/http-error");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(bodyParser.json());

app.use(cors("*"));

app.use("/api", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Nie znaleziono takiej strony.", 404);

  return next(error);
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.to6it.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => app.listen(5000))
  .catch((err) => console.log(err));
