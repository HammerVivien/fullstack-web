import { Router } from "express";
import { cardRouter } from "./card";

export const router = Router();

router.use('/card', cardRouter);