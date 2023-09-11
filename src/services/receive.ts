import { User } from "@prisma/client";
import { PostbackState, ReceivedWebHookState } from "../../types/webHookTypes";
import { callSendApi } from "./api";
import db from "../config/db";

export const handleMessage = async (
  user: User | null, 
  webhookEvent: ReceivedWebHookState['entry'][0]['messaging'][0],
  isUserRef: boolean = false
) => {
  if (!user) return

  let responses

  try {
    if (webhookEvent.message) {
      let message = webhookEvent.message

      if (message.quick_reply) {
        responses = await handleQuickReply()
      } else if (message.attachments) {
        responses = await handleAttachmentMessage()
      } else if (message.text) {
        responses = await handleTextMessage()
      }
    } else if (webhookEvent.postback) {
      responses = await handlePostback(user, webhookEvent.postback)
    } else if (webhookEvent.referral) {
      responses = await handleReferral()
    } else if (webhookEvent.optin) {
      responses = await handleOptIn()
    } else if (webhookEvent.pass_thread_control) {
      responses = await handlePassThreadControlHandover()
    }
  } catch (error) {
    console.error(error)
    responses = {
      text: `An error has occured: '${error}'. We have been notified and \
      will fix the issue shortly!`
    };
  }

  console.log({responses})

  if (Array.isArray(responses)) {
    let delay = 0
    for (let response of responses) {
      sendMessage(user, response, delay * 2000, isUserRef)
      delay++
    }
  } else if (responses) {
    sendMessage(user, responses, 0, isUserRef)
  }
}

const sendMessage = async (user: User, response: any, delay: number, isUserRef?: boolean) =>  {
  // Check if there is delay in the response
  if (response === undefined || response === null) {
    return;
  }
  if ("delay" in response) {
    delay = response["delay"];
    delete response["delay"];
  }
  // Construct the message body
  let requestBody: any = {};
  if (isUserRef) {
    // For chat plugin
    requestBody = {
      recipient: {
        user_ref: user.psid
      },
      message: response
    };
  } else {
    requestBody = {
      recipient: {
        id: user.psid
      },
      message: response
    };
  }

  // Check if there is persona id in the response
  if ("persona_id" in response) {
    let persona_id = response["persona_id"];
    delete response["persona_id"];
    if (isUserRef) {
      // For chat plugin
      requestBody = {
        recipient: {
          user_ref: user.psid
        },
        message: response,
        persona_id: persona_id
      };
    } else {
      requestBody = {
        recipient: {
          id: user.psid
        },
        message: response,
        persona_id: persona_id
      };
    }
  }
  // Mitigate restriction on Persona API
  // Persona API does not work for people in EU, until fixed is safer to not use
  delete requestBody["persona_id"];

  setTimeout(() => callSendApi(requestBody), delay)
}

const handleQuickReply = async () => {}

const handleAttachmentMessage = async () => {}

const handleTextMessage = async () => {}

const handlePostback = async (user: User, postback: PostbackState) => {
  if (postback.title == "Get Started") {
    const sampleCategories = await db.categorySample.findMany()
    const spendingCategories = await Promise.all(sampleCategories.map(v =>
      db.categorySpending.create({
        data: {
          userId: user.id,
          name: v.name,
        }
      })  
    ))

    return {
      attachment:{
        type: "template",
        payload:{
          template_type: "generic",
          elements:[
            {
              title: `Piggy Save xin chào ${user.firstName} ${user.lastName}!`,
              image_url: "https://khoinguonsangtao.vn/wp-content/uploads/2022/10/hinh-anh-lang-que-viet-nam.jpg",
              subtitle: "Dưới đây là các tùy chọn chính",
              buttons:[
                {
                  type: "postback",
                  title: "Xem chi tiêu",
                  payload: "PAYLOAD_MENU_SPENDING"
                },
                {
                  type: "postback",
                  title: "Cập nhập thông tin",
                  payload: "PAYLOAD_MENU_UPDATE"
                },
                {
                  type: "web_url",
                  url: "https://english.viethung.fun",
                  title: "Hướng dẫn sử dụng"
                },          
              ]      
            }
          ]
        }
      }
    }
  }
}
const handleReferral = async () => {}

const handleOptIn = async () => {}

const handlePassThreadControlHandover = async () => {}