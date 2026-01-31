import express from "express";
import {
  storeToken,
  updateLastSeen,
  deleteToken,
  getUserTokens
} from "../controllers/token.controller.js";

const router = express.Router();

router.post("/token", storeToken);
router.patch("/token/seen", updateLastSeen);
router.delete("/token", deleteToken);
router.get("/tokens/:userId", getUserTokens);

export default router;
