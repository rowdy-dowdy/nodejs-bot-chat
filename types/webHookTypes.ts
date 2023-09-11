export type PostbackState = {
  title: string,
  payload: string,
  mid: string,
  referral: any
}

export type ReceivedWebHookState = {
  object: 'page',
  entry: {
    id: string;
    time: Date;
    messaging: {
      sender: { id: string, user_ref?: string },
      recipient: { id: string },
      timestamp: Date,
      postback?: PostbackState,
      referral?: any,
      optin?: any,
      pass_thread_control?: any,
      message: {
        mid: string,
        text: string,
        is_echo?: boolean,
        quick_reply?: any,
        attachments?: any,
        nlp: {
          intents: [],
          entities: {},
          traits: {
            'wit$bye': [
              {
                id: string,
                value: 'true',
                confidence: number
              }
            ],
            'wit$sentiment': [
              {
                id: string,
                value: 'neutral',
                confidence: number
              }
            ]
          },
          detected_locales: [ { locale: string, confidence: number } ]
        }
      }
    }[]
  }[]
}