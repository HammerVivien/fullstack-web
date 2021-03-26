import { Router } from "express";
import { wrap } from '@mikro-orm/core';
import { Deck } from "../entities/deck";
import { User, UserRole } from "../entities/user";
import { authorize } from '../security/authorize';

export const deckRouter = Router();

function canUserSeeDeck(user: User | null, deck: Deck): boolean {
    if (deck.isPublic)
        return true;
    return user?.id == deck.user.id;
}

deckRouter
.use((req, res, next) => {
    req.deckRepository = req.orm.em.getRepository(Deck);
    next();
})
.get("", async (req, res) => {
    const decks = await req.deckRepository!.findAll({isPublic: true});
    res.send(decks);
})
.post("",  authorize(UserRole.User), async (req, res) => {
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

    deck.user = req.orm.em.getReference(User, req.user!.id);

    await req.deckRepository!.persistAndFlush(deck);

    res.send(deck);
})
.get('/:id', async (req, res) => {
    const deck = await req.deckRepository!.findOne({ id: req.params.id }, ["cards"]) as Deck;
    if (!deck || !canUserSeeDeck(req.user as User, deck)) {
        res.sendStatus(404);
    } else {
        res.send({...deck, cards: deck.cards.getIdentifiers()});
    }
})
.delete('/:id', authorize(UserRole.User), async (req, res) => {
    await req.deckRepository!.nativeDelete({ id: req.params.id, user: {id: req.user?.id } });
    res.sendStatus(200);
})
.put('/:id', authorize(UserRole.User), async (req, res) => {
    const deck = await req.deckRepository!.findOne({ id: req.params.id, user: {id: req.user?.id} });
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

    res.send({...deck, cards: deck.cards.getIdentifiers()});
})
.post('/favorite/:id', authorize(UserRole.User), async (req, res) => {
    const deck = await req.deckRepository!.findOne({ id: req.params.id }) as Deck;
    if (!deck || !canUserSeeDeck(req.user as User, deck)) {
        res.sendStatus(404);
        return;
    }
    req.user?.favorites.add(deck);

    const wrappedDeck = wrap(deck);
    wrappedDeck.assign(deck, { em: req.orm.em });

    await req.deckRepository!.persistAndFlush(deck);
})
.post('/unfavorite/:id', authorize(UserRole.User), async (req, res) => {
    const deck = await req.deckRepository!.findOne({ id: req.params.id }) as Deck;
    if (!deck || !canUserSeeDeck(req.user as User, deck)) {
        res.sendStatus(404);
        return;
    }
    req.user?.favorites.remove(deck);

    const wrappedDeck = wrap(deck);
    wrappedDeck.assign(deck, { em: req.orm.em });

    await req.deckRepository!.persistAndFlush(deck);
});