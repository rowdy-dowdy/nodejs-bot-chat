import db from "../config/db"

export const findUser = async (psid: string) => {
  const user = await db.user.findFirst({
    where: {
      psid
    }
  })

  return user
}

export const createUser = async (data: {
  psid: string, firstName: string, lastName: string,
  gender: 'male' | 'female', profile_pic?: string
  locale: string, timezone: number
} | { isGuest: true, psid: string }) => {

 const user = await db.user.create({
  data: 'isGuest' in data ? {
    psid: data.psid,
    isGuest: true
  } : {
    psid: data.psid,
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender,
    locale: data.locale,
    timezone: data.timezone,
    profile_pic: data.profile_pic
  }
 }).catch((e) => null)

 return user
}

export const findOrCreateUser = async (psid: string) => {
  const upsertUser = await db.user.upsert({
    where: {
      psid
    },
    update: {},
    create: {
      psid,
      isGuest: true
    },
  })

  return upsertUser
}