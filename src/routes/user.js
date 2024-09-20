import { Router } from "express";
import { Client, Agent } from "../models/user.js";
import { hashPassword } from "../util/helper.js";
import passport from "passport";
import "../strategies/clientStrategy.js";
import "../strategies/agentStrategy.js";

const router = Router();

router.post("/login/:role", (req, res, next) => {
  const role = req.params.role;
  const strategy = role === "Agent" ? "agent-local" : "client-local";

  passport.authenticate(strategy, (err, user, info) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: info.message || "Authentication failed" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Login failed" });
      }
      const { _id, username, email, transactions, phoneNumber, clientType, onCall, ticket } = user;
      res.status(200).json({ _id, username, email, transactions, phoneNumber, onCall, ticket, clientType });
    });
  })(req, res, next);
});

router.post("/register/:role", async (req, res) => {
  try {
    const data = req.body;
    const role = req.params.role;
    data.password = await hashPassword(data.password);
    let user;
    if (role === "Agent") {
      user = new Agent({ ...data });
    } else {
      user = new Client({ ...data, clientType: role });
    }
    await user.save();
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.status(401).send("Failed to register");
  }
});

export default router;
