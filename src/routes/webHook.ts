import express, { Request, Response } from "express";
import * as crypto from "crypto";
import { postSetupProfile, getWebhook, getWebhookMessage, postWebhook } from "../controllers/webhook";

const router = express.Router()

router.get("/webhook", getWebhook)
router.post('/webhook', postWebhook)
router.get("/messaging-webhook", getWebhookMessage)
router.post("/messenger_profile", postSetupProfile)

export {
  router as webHookRouter
}