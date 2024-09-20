import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import router from "./routes/router.js";
import dotenv from "dotenv";
// import "./strategies/local.mjs";
dotenv.config();
const app = express();

mongoose
  .connect("mongodb://localhost:27017/hackware")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});

app.use("/", router);

app.get("/", (req, res) => {
  res.json("hello world");
});
