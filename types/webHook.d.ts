export {}

declare global {
  interface MessagingReferral {
    source: string;
    type: string;
    ref: string;
    referer_uri: string;
  }
  interface MessagingPostback {
    title: string;
    payload: string;
    referral: MessagingReferral;
  }
  interface MessagingPostback {
    title: string;
    payload:string;
    referral: MessagingReferral;
  }

  interface MessagingDelivery {
    mids: string[];
    watermark: number;
    seq?: number;
  }
  export interface MessagingEvent {
    message: {
      is_echo: boolean;
      app_id: string;
      metadata: string;
      mid: string;
      text: string;
      attachments: MessageAttachment;
      quick_reply: MessageQuick_Reply;
    };
    delivery: MessagingDelivery;
    postback: MessagingPostback;
    read: {
      watermark: number;
      seq?: number;
    }
    optin: {
      ref: string;
      user_ref: string;
    };
    account_linking: {
      status: 'linked' | 'unlinked',
      authorization_code: string;
    };
    sender: {
      id: string;
    }
    recipient: {
      id: string;
    };
    timestamp: string;
  }
  interface PageEntry {
    id: string;
    time: string;
    messaging: [];
  }
  interface MessagesSender {
    id: string;
  }
  interface MessagesRecipient {
    id: string;
  }
  interface MessageAttachment {
    type: string;
    payload: string;
  }
  interface MessageQuick_Reply {
    payload: string;
  }
  interface Message {
    mid: string;
    text: string;
    attachments: Array<MessageAttachment>;
    quick_reply: MessageQuick_Reply;
  }
}