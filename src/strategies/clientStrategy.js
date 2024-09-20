import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Client } from "../models/user.js";
import { comparePassword } from "../util/helper.js";

passport.use(
  "client-local",
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await Client.findOne({ username });
      if (!user) return done(null, false, { message: "User not found" });
      if (!comparePassword(password, user.password)) return done(null, false, { message: "Incorrect password" });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Client.findById(id);
    if (!user) throw new Error("User not found");
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
