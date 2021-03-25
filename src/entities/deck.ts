import { Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Card } from "./card";
import { DeckCardPair as DeckCard } from "./deckCards";

@Entity()
export class Deck {
    
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;

    @Property()
    description!: string;

    @Property()
    createdAt: Date = new Date();
    @Property({onUpdate: () => new Date()})
    modifiedAt: Date = new Date();
    
    @OneToMany(() => DeckCard, pair => pair.deck)
    cards = new Collection<DeckCard>(this);
}