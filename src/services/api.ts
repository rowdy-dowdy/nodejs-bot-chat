import config from "../config";

export const callSendApi = async (requestBody: object) => {
  let url = new URL(`${config.apiUrl}/me/messages`)
  url.search = new URLSearchParams({
    access_token: config.accessToken
  }).toString()

  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    console.warn(
      `Unable to call Send API: ${response.statusText}`,
      await response.json()
    )
  }
}

export const getUserProfile = async (senderIgsid: string) => {
  let url = new URL(`${config.apiUrl}/${senderIgsid}`)
  url.search = new URLSearchParams({
    access_token: config.accessToken,
    fields: "first_name, last_name, gender, locale, timezone"
  }).toString()

  let response = await fetch(url)

  if (response.ok) {
    let userProfile = await response.json()
    return {
      firstName: userProfile.first_name,
      lastName: userProfile.last_name,
      gender: userProfile.gender,
      locale: userProfile.locale,
      timezone: userProfile.timezone,
      profile_pic: userProfile.profile_pic
    }
  } else {
    console.warn(
      `Could not load profile for ${senderIgsid}: ${response.statusText}`,
      await response.json()
    );
    return null
  }
}

export const callMessengerProfileAPI = async (requestBody: object) => {
  let url = new URL(`${config.apiUrl}/me/messenger_profile`)
  url.search = new URLSearchParams({
    access_token: config.accessToken,
  }).toString()

  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  })

  if (response.ok) {
    console.log(`Request sent.`)
  } else {
    console.warn(
      `Unable to callMessengerProfileAPI: ${response.statusText}`,
      await response.json()
    );
    return null
  }
}

export const typingOnMessage = async (psid: string, isUserRef: boolean = false) => {
  let requestBody: any = {}

  if (isUserRef) {
    requestBody = {
      recipient: {
        user_ref: psid
      },
      sender_action: 'typing_on'
    }
  }
  else {
    requestBody = {
      recipient: {
        id: psid
      },
      sender_action: 'typing_on'
    }
  }
  callSendApi(requestBody)
}