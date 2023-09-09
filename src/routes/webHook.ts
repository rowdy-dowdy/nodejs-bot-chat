import express, { Request, Response } from "express";
import * as crypto from "crypto";
import { getWebhook, getWebhookMessage, postWebhook } from "../controllers/webhook";

const router = express.Router()

router.get("/webhook", getWebhook)
router.post('/webhook', postWebhook)
router.get("/messaging-webhook", getWebhookMessage)

export {
  router as webHookRouter
}