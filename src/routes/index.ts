import express, { Express } from "express";
import { webRouter } from './web';
import { webHookRouter } from "./webHook";

const routes = (app: Express) => {
  app.use(webRouter)
  app.use(webHookRouter)
}

export default routes