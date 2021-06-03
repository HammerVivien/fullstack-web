import { wrap } from '@mikro-orm/core';
import { Router } from 'express';
import { authorize } from '../security/authorize';
import { Card } from '../entities/card';
import { UserRole } from '../entities/user';
import { passport } from "../security/passport";
import { CardType } from '../entities/CardType';
import { Monster } from '../entities/monster';

export const cardRouter = Router();

cardRouter
.use((req, res, next) => {
    req.cardRepository = req.orm.em.getRepository(Card);
    next();
})
.get('', async (req, res) => {
    const cards = await req.cardRepository!.findAll(["monster"]);
    let ret = [];
    for(let card of cards) {
        if (card.monster) {
            let {level, attack, defense, race, attribute} = card.monster;
            let {id, name, description, type, subType} = card;
            card = {id, name, description, type, subType, level, attack, defense, race, attribute};
        }
        ret.push(card);
    }
    res.send(ret);
})
.get('/search', async (req, res) => {
    const cards = await req.cardRepository!.find(req.query, ["monster"]);
    let ret = [];
    for(let card of cards) {
        if (card.monster) {
            let {level, attack, defense, race, attribute} = card.monster;
            let {id, name, description, type, subType} = card;
            card = {id, name, description, type, subType, level, attack, defense, race, attribute};
        }
        ret.push(card);
    }
    res.send(ret);
})
.get('/:id', async (req, res) => {
    const card = await req.cardRepository!.findOne({ id: req.params.id }, ["monster"]) as Card;
    if (!card) {
        res.sendStatus(404);
        return;
    }
    let {id, name, description, type, subType} = card;
    if (card.monster) {
        let {level, attack, defense, race, attribute} = card.monster;
        res.send({id, name, description, type, subType, level, attack, defense, race, attribute});
    } else {
        res.send({id, name, description, type, subType});
    }
})
.use(passport.authenticate('jwt', {session: false}))
.post('', authorize(UserRole.Admin), async (req, res) => {
    
    const card = new Card();
    const wrappedCard = wrap(card);
    wrappedCard.assign(req.body);
    let monster : Monster | null = null;
    if (card.type == CardType.Monster) {
        monster = new Monster();
        const wrappedMonster = wrap(monster);
        wrappedMonster.assign(req.body);
        card.monster = monster;

        await req.orm.em.getRepository(Monster).persistAndFlush(monster);
    }

    await req.cardRepository!.persistAndFlush(card);

    let {id, name, description, type, subType} = card;

    if (monster) {
        let {level, attack, defense, race, attribute} = monster;
        res.send({id, name, description, type, subType, level, attack, defense, race, attribute});
    } else {
        res.send({id, name, description, type, subType});
    }
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