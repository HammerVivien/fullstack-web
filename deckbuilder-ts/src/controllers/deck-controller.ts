import { Router } from "express";
import { wrap } from '@mikro-orm/core';
import { Deck } from "../entities/deck";
import { User, UserRole } from "../entities/user";
import { authorize } from '../security/authorize';
import { passport } from "../security/passport";
import { DeckCardPair } from "../entities/deckCards";

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
    const decks = await req.deckRepository!.find({isPublic: true});
    res.send(decks);
})
.get('/:id', async (req, res) => {
    const deck = await req.deckRepository!.findOne({ id: req.params.id }, ["cards", "favorites"]) as Deck;
    if (!deck || !canUserSeeDeck(req.user as User, deck)) {
        res.sendStatus(404);
    } else {
        res.send({...deck, user: deck.user.id, cards: deck.cards.getIdentifiers(), favorites: deck.favorites.getIdentifiers()});
    }
})
.use(passport.authenticate('jwt', {session: false}))
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
.delete('/:id', authorize(UserRole.User), async (req, res) => {
    await req.deckRepository!.nativeDelete({ id: req.params.id, user: {id: req.user?.id } });
    res.sendStatus(200);
})
.put('/:id', authorize(UserRole.User), async (req, res) => {
    const deck = await req.deckRepository!.findOne({ id: req.params.id, user: {id: req.user?.id} }, ["cards"]) as Deck;
    if (!deck) {
        res.sendStatus(404);
        return;
    }

    let cards = null;
    if (req.body["cards"]) {
        cards = req.body["cards"] as Array<number>;
        cards = cards.map((id, index) => ({card: id, order: index, deck: deck.id}));
    }
    
    const wrappedDeck = wrap(deck);
    
    wrappedDeck.assign({
        name: req.body.name || deck.name,
        cards: cards || deck.cards,
        description: req.body.description || deck.description,
        isPublic: req.body.isPublic || deck.isPublic
    }, { em: req.orm.em });
    
    // Csak létező kártyákat tehetünk bele
    for (const pair of deck.cards) {
        req.orm.em.merge(pair, true);
    }
    
    await req.deckRepository!.persistAndFlush(deck);
    res.send({...deck, cards: deck.cards.getIdentifiers(), user: deck.user.id});
})
.post('/favorite/:id', authorize(UserRole.User), async (req, res) => {
    const deck = await req.deckRepository!.findOne({ id: req.params.id }, ["favorites"]) as Deck;
    if (!deck || !canUserSeeDeck(req.user as User, deck)) {
        res.sendStatus(404);
        return;
    }
    const user = await req.orm.em.getRepository(User).findOne({id: req.user?.id}, ["favorites"]) as User;
    deck.favorites.add(user);

    const wrappedDeck = wrap(deck);
    wrappedDeck.assign(deck, { em: req.orm.em });

    await req.deckRepository!.persistAndFlush(deck);

    const {id, username, role, decks} = user;
    res.send({id, username, role, decks, favorites: user.favorites.getIdentifiers()});
})
.post('/unfavorite/:id', authorize(UserRole.User), async (req, res) => {
    const deck = await req.deckRepository!.findOne({ id: req.params.id }, ["favorites"]) as Deck;
    if (!deck || !canUserSeeDeck(req.user as User, deck)) {
        res.sendStatus(404);
        return;
    }
    const user = await req.orm.em.getRepository(User).findOne({id: req.user?.id}, ["favorites"]) as User;
    deck.favorites.remove(user);
    
    const wrappedDeck = wrap(deck);
    wrappedDeck.assign(deck, { em: req.orm.em });

    await req.deckRepository!.persistAndFlush(deck);
    const {id, username, role, decks} = user;
    res.send({id, username, role, decks, favorites: user.favorites.getIdentifiers()});
});