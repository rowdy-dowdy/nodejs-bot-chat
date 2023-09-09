import express, { Express } from "express";

const configViewPublic = (app: Express) => {
  app.use(express.static('./public'))
  app.set("view engine", "ejs")
  app.set("views", "./src/views")
}

export default configViewPublic