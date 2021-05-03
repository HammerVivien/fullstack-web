import { Collection, Entity, Enum, Filter, ManyToMany, OneToMany, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { CardSubType, CardType } from "./CardType";
import { Deck } from "./deck";
import { DeckCardPair } from "./deckCards";
import { Monster } from "./monster";

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

    /*
    @OneToMany(() => DeckCardPair, pair => pair.card, {orphanRemoval: true})
    decks = new Collection<DeckCardPair>(this);
*/
    @OneToOne(() => Monster, monster => monster.card, {owner: true, orphanRemoval: true, nullable: true, hidden: true})
    monster?: Monster;
}