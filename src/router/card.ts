import { Router } from "express";

export const cardRouter = Router();

const cards = [
    {"name": "1"},
    {"name": "2"},
];

cardRouter
.get("", (req, res) => {
    res.json(cards);
})
.get("/:id", (req, res) => {
    res.json(cards[0]);
});