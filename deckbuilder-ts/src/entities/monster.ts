import { Collection, Entity, Enum, Filter, ManyToMany, OneToMany, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Card } from "./card";
import { Attribute, CardSubType, CardType } from "./CardType";
import { Deck } from "./deck";
import { DeckCardPair } from "./deckCards";

@Entity()
export class Monster {
    
    @PrimaryKey()
    id!: number;
    
    @OneToOne(() => Card, card => card.monster)
    card!: Card;

    @Property()
    level!: number;
    
    @Property()
    attack!: number;
    
    @Property()
    defense!: number;

    @Property()
    race!: string;

    @Enum()
    attribute!: Attribute;

}