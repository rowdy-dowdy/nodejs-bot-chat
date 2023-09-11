import express, { Request, Response } from "express";

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
  return res.render('home.ejs')
});

export {
  router as webRouter
} 