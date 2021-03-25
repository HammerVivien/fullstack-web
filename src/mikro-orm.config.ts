import { Configuration, IDatabaseDriver, Options } from "@mikro-orm/core";
import { Card } from "./entities/card";
import { Deck } from "./entities/deck";
import { DeckCardPair } from "./entities/deckCards";

export default {
    entities: [Card, Deck, DeckCardPair],
    dbName: 'yugioh-deck.db',
    type: 'sqlite',
} as Options<IDatabaseDriver> | Configuration<IDatabaseDriver>;