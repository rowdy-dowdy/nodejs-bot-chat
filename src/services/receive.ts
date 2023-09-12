import { User } from "@prisma/client";
import { PayloadState, PostbackState, ReceivedWebHookState } from "../../types/webHookTypes";
import { callSendApi } from "./api";
import db from "../config/db";
import { findOrCreateCategorySpending } from "../controllers/database";

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
  if (postback.payload == "GET_STARTED") {
    await findOrCreateCategorySpending(user.id)

    return createTemplateResponse({
      template_type: "generic",
      elements: [
        {
          title: `Piggy Save xin chào ${user.firstName} ${user.lastName}!`,
          image_url: "https://khoinguonsangtao.vn/wp-content/uploads/2022/10/hinh-anh-lang-que-viet-nam.jpg",
          subtitle: "Dưới đây là các tùy chọn chính",
          buttons: [
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
              type: "postback",
              title: "Hướng dẫn sử dụng",
              payload: "PAYLOAD_GUIDE"
            },
          ]        
        }
      ]    
    })
  }
  else if (postback.payload == "PAYLOAD_MENU_SPENDING") {
    return createTemplateResponse({
      template_type: "generic",
      elements: [
        {
          title: `Piggy Save xin chào ${user.firstName} ${user.lastName}!`,
          image_url: "https://img.freepik.com/free-vector/investor-with-laptop-monitoring-growth-dividends-trader-sitting-stack-money-investing-capital-analyzing-profit-graphs-vector-illustration-finance-stock-trading-investment_74855-8432.jpg?w=1380&t=st=1694485866~exp=1694486466~hmac=a31faacfa583188ffcacd457e161821ef8702fbcfc1722c847941c92ec831373",
          subtitle: "Xem lịch sử chi tiêu",
          buttons: [
            {
              type: "postback",
              title: "Chi tiêu trong ngày",
              payload: "PAYLOAD_MENU_SPENDING"
            },
            {
              type: "postback",
              title: "Chi tiêu trong tháng",
              payload: "PAYLOAD_MENU_UPDATE"
            },
          ]        
        }
      ]
    })
  }
  else if (postback.payload == "PAYLOAD_GUIDE") {
    return {
      text: `
        ❤️ CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TRUYỀN THÔNG SỐ Piggy Save tự hào là đơn vị hợp tác với Việt Hùng Ít, thiết kế bộ sản phẩm truyền thông tổ chức cho Festival Cao nguyên trắng Bắc Hà 2023 với chủ đề "Sắc thu cao nguyên"
        🌾 Hiện tại, chuỗi sự kiện vẫn đang tiếp tục diễn ra đến tháng 10. Các bạn hãy nhân dịp này đến với Bắc Hà để tham quan, trải nghiệm, tìm hiểu về cảnh sắc, văn hóa, ẩm thực và người dân thân thiện nơi đây nhé!
        📣 Chi tiết và thời gian cụ thể các sự kiện ở ảnh cuối
        -------------------------------
        Việt Hùng ít
        ☎️ Hotline: 0933.933.237 
        📩 Email: viet.hung.2898@gmail.com
        🌐 Website: https://english.viethung.fun/
        🏢 Địa chỉ: số 304 - Tổ 2 - Phường Tân Thịnh - TP.Thái Nguyên
      `
    }
  }
}
const handleReferral = async () => {}

const handleOptIn = async () => {}

const handlePassThreadControlHandover = async () => {}

const createPayload = (text: PayloadState) => text

const createTemplateResponse = (data: {
  template_type: 'generic', 
  elements: {
    title: string, image_url: string, subtitle?: string,
    buttons: ({
      type: "postback",
      title: string,
      payload: PayloadState
    } | {
      type: "web_url",
      url: string,
      title: string
    })[]
  }[]
}) => {
  return {
    attachment:{
      type: "template",
      payload: {
        template_type: data.template_type,
        elements: data.elements
      }
    }
  }
}