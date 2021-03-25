import { Router } from "express";
import { cardRouter } from "./card-controller";
import { deckRouter } from "./deck-controller";

export const controllers = Router();

controllers.use('/card', cardRouter);
controllers.use('/deck', deckRouter)