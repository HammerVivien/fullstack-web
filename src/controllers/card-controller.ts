import { wrap } from '@mikro-orm/core';
import { Router } from 'express';
import { Card } from '../entities/card';

export const cardRouter = Router();

cardRouter
.use((req, res, next) => {
    req.cardRepository = req.orm.em.getRepository(Card);
    next();
})
.get('', async (req, res) => {
    const cards = await req.cardRepository!.findAll();
    res.send(cards);
})
.post('', async (req, res) => {
    const card = new Card();
    const wrappedCard = wrap(card);
    wrappedCard.assign(req.body);

    await req.cardRepository!.persistAndFlush(card);

    res.send(card);
})
.get('/:id', async (req, res) => {
    const card = await req.cardRepository!.findOne({ id: req.params.id });
    res.send(card);
});