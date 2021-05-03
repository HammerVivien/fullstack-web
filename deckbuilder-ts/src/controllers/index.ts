import { Router } from "express";
import { cardRouter } from "./card-controller";
import { deckRouter } from "./deck-controller";
import { userRouter } from "./user-controller";

export const controllers = Router();

controllers.use('/card', cardRouter);
controllers.use('/deck', deckRouter);
controllers.use('/user', userRouter);