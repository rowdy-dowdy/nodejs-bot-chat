import express, { Request, Response } from "express";

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
  return res.send('Express + TypeScript Server 312');
});

export {
  router as webRouter
} 