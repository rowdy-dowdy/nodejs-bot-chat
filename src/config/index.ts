import dotenv from 'dotenv'
dotenv.config()

const config = {
  verifyToken: process.env.VERIFY_TOKEN,
  port: process.env.PORT || 3000,
  hostName: process.env.HOSTNAME || `http://localhost:${process.env.PORT || 3000}`
}

export default config