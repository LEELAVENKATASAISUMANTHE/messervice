import redis from "../config/redis.js";
import { v4 as uuidv4 } from "uuid";
/**
 * Register or update an FCM token
 * POST /notify/token
 */
export const storeToken = async (req, res) => {
  try {
    const { userId, token, platform } = req.body;
    const deviceId = uuidv4();

    if (!userId || !token || !platform || !deviceId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const now = Date.now();

    // 1. Store token metadata
    await redis.hSet(`fcm:token:${token}`, {
      userId,
      platform,
      deviceId,
      createdAt: now,
      lastSeenAt: now
    });

    // 2. Map token to user
    await redis.sAdd(`user:${userId}:tokens`, token);

    return res.status(201).json({
      message: "Token stored successfully"
    });
  } catch (err) {
    console.error("storeToken error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update lastSeenAt
 * PATCH /notify/token/seen
 */
export const updateLastSeen = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    await redis.hSet(`fcm:token:${token}`, {
      lastSeenAt: Date.now()
    });

    res.json({ message: "lastSeenAt updated" });
  } catch (err) {
    console.error("updateLastSeen error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Delete token
 * DELETE /notify/token
 */
export const deleteToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // 1. Find userId
    const userId = await redis.hGet(`fcm:token:${token}`, "userId");

    if (userId) {
      // 2. Remove token from user's set
      await redis.sRem(`user:${userId}:tokens`, token);
    }

    // 3. Delete token hash
    await redis.del(`fcm:token:${token}`);

    res.json({ message: "Token deleted successfully" });
  } catch (err) {
    console.error("deleteToken error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get all tokens for a user
 * GET /notify/tokens/:userId
 */
export const getUserTokens = async (req, res) => {
  try {
    const { userId } = req.params;

    const tokens = await redis.sMembers(`user:${userId}:tokens`);

    res.json({
      userId,
      tokens
    });
  } catch (err) {
    console.error("getUserTokens error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
