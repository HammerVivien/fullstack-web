import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Card } from "./card";
import { DeckCardPair as DeckCard } from "./deckCards";
import { User } from "./user";

@Entity()
export class Deck {
    
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;

    @Property()
    description!: string;

    @Property()
    isPublic: boolean = false;

    @Property()
    createdAt: Date = new Date();
    @Property({onUpdate: () => new Date()})
    modifiedAt: Date = new Date();
    
    @OneToMany(() => DeckCard, pair => pair.deck)
    cards = new Collection<DeckCard>(this);

    @ManyToOne(() => User)
    user!: User;

    @ManyToMany(() => User, user => user.favorites)
    favorites = new Collection<User>(this);
}