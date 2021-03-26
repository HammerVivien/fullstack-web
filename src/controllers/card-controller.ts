import { wrap } from '@mikro-orm/core';
import { Router } from 'express';
import { authorize } from '../security/authorize';
import { Card } from '../entities/card';
import { UserRole } from '../entities/user';

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
.post('', authorize(UserRole.Admin), async (req, res) => {
    const card = new Card();
    const wrappedCard = wrap(card);
    wrappedCard.assign(req.body);

    await req.cardRepository!.persistAndFlush(card);

    res.send(card);
})
.get('/search', async (req, res) => {
    const cards = await req.cardRepository!.findAll(req.params);
    res.send(cards);
})
.get('/:id', async (req, res) => {
    const card = await req.cardRepository!.findOne({ id: req.params.id });
    res.send(card);
})
.delete('/:id', authorize(UserRole.Admin), async (req, res) => {
    await req.cardRepository!.nativeDelete({ id: req.params.id });
    res.sendStatus(200);
})
.put('/:id', authorize(UserRole.Admin), async (req, res) => {
    const card = await req.cardRepository!.findOne({ id: req.params.id });
    if (!card) {
        res.sendStatus(404);
    }
    const wrappedCard = wrap(card);
    wrappedCard.assign(req.body);

    await req.cardRepository!.persistAndFlush(card);

    res.send(card);
});