import { Collection, Entity, Enum, ManyToMany, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Deck } from "./deck";

@Entity()
export class User {
    @PrimaryKey()
    id!: number;

    @Property()
    username!: string;

    @Property({hidden: true})
    password!: string;

    @Enum()
    role: UserRole = UserRole.User;

    @OneToMany(() => Deck, deck => deck.user)
    decks = new Collection<Deck>(this);

    @ManyToMany(() => Deck, deck => deck.favorites, {owner: true})
    favorites = new Collection<Deck>(this);
}


export enum UserRole {
    Guest = 'GUEST',
    User = 'USER',
    Admin = 'ADMIN'
}