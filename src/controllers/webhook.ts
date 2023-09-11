import { Request, Response } from "express";
import config from "../config";
import { ReceivedWebHookState } from "../../types/webHookTypes";
import { callMessengerProfileAPI, getUserProfile, typingOnMessage } from "../services/api";
import { createUser, findOrCreateUser, findUser } from "./database";
import { handleMessage } from "../services/receive";

export const getWebhook = async (req: Request, res: Response) => {
  let mode = req.query["hub.mode"]
  let token = req.query["hub.verify_token"]
  let challenge = req.query["hub.challenge"]

  if (mode && token) {
    if (mode === "subscribe" && token === config.verifyToken) {
      console.log("WEBHOOK_VERIFIED")
      res.status(200).send(challenge)
    } else {
      res.sendStatus(403)
    }
  }
  res.sendStatus(403)
}

export const postWebhook = async (req: Request, res: Response) => {
  let body: ReceivedWebHookState = req.body;

  console.log(`\u{1F7EA} Received webhook:`);
  console.dir(body, { depth: null });

  // Check if this is an event from a page subscription
  if (body.object === "page") {
    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED")

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(async function (entry) {
      // if ("changes" in entry) {
      //   // Handle Page Changes event
      //   let receiveMessage = new Receive();
      //   if (entry.changes[0].field === "feed") {
      //     let change = entry.changes[0].value;
      //     switch (change.item) {
      //       case "post":
      //         return receiveMessage.handlePrivateReply(
      //           "post_id",
      //           change.post_id
      //         );
      //       case "comment":
      //         return receiveMessage.handlePrivateReply(
      //           "comment_id",
      //           change.comment_id
      //         );
      //       default:
      //         console.warn("Unsupported feed change type.");
      //         return;
      //     }
      //   }
      // }

      // Iterate over webhook events - there may be multiple
      entry.messaging.forEach(async function (webhookEvent) {
        // Discard uninteresting events
        if ("read" in webhookEvent) {
          console.log("Got a read event")
          return
        } else if ("delivery" in webhookEvent) {
          console.log("Got a delivery event")
          return
        } else if (webhookEvent.message && webhookEvent.message.is_echo) {
          console.log(
            "Got an echo of our send, mid = " + webhookEvent.message.mid
          )
          return
        }

        // Get the sender PSID
        let senderPsid = webhookEvent.sender.id
        // Get the user_ref if from Chat plugin logged in user
        let user_ref = webhookEvent.sender.user_ref
        // Check if user is guest from Chat plugin guest user
        let guestUser = isGuestUser(webhookEvent)

        typingOnMessage(senderPsid, typeof user_ref != "undefined")

        if (senderPsid != null && senderPsid != undefined) {
          const user = await findUser(senderPsid)
          if (!user) {
            const userFb = await getUserProfile(senderPsid)
            if (!guestUser && userFb) {
              const userCurrent = await createUser({ ...userFb, psid: senderPsid })
              handleMessage(userCurrent, webhookEvent)
            } else {
              const userCurrent = await createUser({ isGuest: true, psid: senderPsid })
              handleMessage(userCurrent, webhookEvent)
            }
          } else {
            handleMessage(user, webhookEvent)
          }
        } else if (user_ref != null && user_ref != undefined) {
          const userCurrent = await findOrCreateUser(senderPsid)
          handleMessage(userCurrent, webhookEvent, true)
        }
      })
    })
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404)
  }
}

function isGuestUser(webhookEvent: ReceivedWebHookState['entry'][0]['messaging'][0]) {
  let guestUser = false
  if ("postback" in webhookEvent) {
    if (webhookEvent.postback && "referral" in webhookEvent.postback) {
      if ("is_guest_user" in webhookEvent.postback.referral) {
        guestUser = true
      }
    }
  }
  return guestUser;
}

export const getWebhookMessage = async (req: Request, res: Response) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === config.verifyToken) {
      console.log("WEBHOOK_VERIFIED")
      res.status(200).send(challenge)
    } else {
      res.sendStatus(403)
    }
  }
}

export const postSetupProfile = async (req: Request, res: Response) => {
  await callMessengerProfileAPI({
    get_started: { "payload": "Thiết lập ngay" },
    greeting: [
      {
        locale: 'default',
        text: 'Chào mừng bạn đến với ứng dụng của chúng tôi!'
      }
    ],
    persistent_menu: [
      {
        locale: "default",
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: "postback",
            title: "Talk to an agent",
            payload: "CARE_HELP"
          },
          {
            type: "postback",
            title: "Outfit suggestions",
            payload: "CURATION"
          },
          {
            type: "web_url",
            title: "Shop now",
            url: "https://www.originalcoastclothing.com/",
            webview_height_ratio: "full"
          }
        ]
      }
    ],
    whitelisted_domains: [config.hostName]
  })

  res.send({ message: 'Successfully' })
}