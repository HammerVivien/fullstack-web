import { Injectable } from '@angular/core';
import { Card } from './domain/card';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  cards: Card[] = [{name: "Blue-Eyes White Dragon", description: "asd", id: 1}];

  constructor() { }

  getCards(): Card[]{
    return this.cards;
  }

  createCard(card: Card): void {
    this.cards.push(card);
  }
}
