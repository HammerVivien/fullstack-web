import { Router } from "express";
import { wrap } from '@mikro-orm/core';
import { Deck } from "../entities/deck";

export const deckRouter = Router();

deckRouter
.use((req, res, next) => {
    req.deckRepository = req.orm.em.getRepository(Deck);
    next();
})
.get("", async (req, res) => {
    const decks = await req.deckRepository!.findAll();
    res.send(decks);
})
.post("", async (req, res) => {
    const deck = new Deck();
    const wrappedDeck = wrap(deck);
    
    let cards = req.body["cards"] as Array<number>;
    req.body["cards"] = cards.map((id, index) => ({card: id, order: index}));
    
    wrappedDeck.assign(req.body, { em: req.orm.em });

    // Csak létező kártyákat tehetünk bele
    for (const pair of deck.cards) {
        if (pair.card) {
            req.orm.em.merge(pair);
        }
    }

    await req.deckRepository!.persistAndFlush(deck);
    console.log(deck);
    

    res.send(deck);
})
.get('/:id', async (req, res) => {
    const deck = await req.deckRepository!.findOne({ id: req.params.id }, ["cards"]);
    res.send({...deck, cards: deck.cards.getIdentifiers()});
})
.delete('/:id', async (req, res) => {
    await req.deckRepository!.nativeDelete({ id: req.params.id });
    res.sendStatus(200);
})
.put('/:id', async (req, res) => {
    const deck = await req.deckRepository!.findOne({ id: req.params.id });
    if (!deck) {
        res.sendStatus(404);
    }
    const wrappedDeck = wrap(deck);

    let cards = req.body["cards"] as Array<number>;
    req.body["cards"] = cards.map((id, index) => ({card: id, order: index}));
    
    wrappedDeck.assign(req.body, { em: req.orm.em });

    // Csak létező kártyákat tehetünk bele
    for (const card of deck.cards) {
        req.orm.em.merge(card);
    }

    await req.deckRepository!.persistAndFlush(deck);

    res.send(deck);
});