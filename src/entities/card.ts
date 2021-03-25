import { Collection, Entity, Enum, ManyToMany, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { CardSubType, CardType } from "./CardType";
import { Deck } from "./deck";
import { DeckCardPair } from "./deckCards";

@Entity()
export class Card {
    
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;

    @Property()
    description!: string;

    @Enum()
    type!: CardType;

    @Enum()
    subType!: CardSubType

    @Property()
    createdAt: Date = new Date();
    @Property({onUpdate: () => new Date()})
    modifiedAt: Date = new Date();
}