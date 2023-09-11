import express, { Express, Request, Response } from 'express'
import routes from './src/routes/index';
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import config from './src/config';
import configViewPublic from './src/config/public';

const app: Express = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({credentials: true, origin: config.hostName}))

configViewPublic(app)

routes(app)

app.listen(config.port, () => {
  console.log(`⚡️[server]: Server is running at ${config.hostName}`);
});