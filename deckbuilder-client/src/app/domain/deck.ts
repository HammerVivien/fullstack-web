import { Card } from "./card";
import { User } from "./user";

export interface Deck {
    id: number;
    name: string;
    description: string;
    isPublic: boolean;
    createdAt: string;
    modifiedAt: string;
    cards: Card[];
    user: User;
    favorites: User[];
}
