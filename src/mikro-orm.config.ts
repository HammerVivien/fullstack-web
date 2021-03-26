import { Configuration, IDatabaseDriver, Options } from "@mikro-orm/core";
import { Card } from "./entities/card";
import { Deck } from "./entities/deck";
import { DeckCardPair } from "./entities/deckCards";
import { User } from "./entities/user";

export default {
    entities: [Card, Deck, DeckCardPair, User],
    dbName: 'yugioh-deck.db',
    type: 'sqlite',
} as Options<IDatabaseDriver> | Configuration<IDatabaseDriver>;