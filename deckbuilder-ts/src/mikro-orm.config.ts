import { Configuration, IDatabaseDriver, Options } from "@mikro-orm/core";
import { env } from "process";
import { Card } from "./entities/card";
import { Deck } from "./entities/deck";
import { DeckCardPair } from "./entities/deckCards";
import { Monster } from "./entities/monster";
import { User } from "./entities/user";

export default {
    entities: [Card, Monster, Deck, DeckCardPair, User],
    dbName: env.NODE_ENV == 'test' ? 'yugioh-deck-test.db' : 'yugioh-deck.db',
    type: 'sqlite',
} as Options<IDatabaseDriver> | Configuration<IDatabaseDriver>;