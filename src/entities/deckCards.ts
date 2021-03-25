import { Entity, ManyToOne, PrimaryKeyType, Property } from "@mikro-orm/core";
import { Card } from "./card";
import { Deck } from "./deck";

@Entity()
export class DeckCardPair {

    @ManyToOne(() => Card, {primary: true})
    card!: Card;

    @ManyToOne(() => Deck, {primary: true})
    deck!: Deck;

    @Property({primary: true})
    order!: number;

    // Ez kell typecheck-hez
    [PrimaryKeyType]: [number, number, number];

}