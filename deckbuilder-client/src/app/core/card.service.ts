import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Card, CardSubType, CardType, Attribute } from '../domain/card';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private httpClient: HttpClient) {}

  async getCards(): Promise<Card[]> {
    return (await this.httpClient.get('/api/card').toPromise()) as Card[];
  }

  async getCard(cardId: number): Promise<Card> {
    return (await this.httpClient
      .get(`/api/card/${cardId}`)
      .toPromise()) as Card;
  }

  async createCard(card: Card): Promise<Card> {
    return (await this.httpClient
      .post('/api/card', card)
      .toPromise()) as Card;
  }

  async editCard(cardToEdit: Card, value: Card): Promise<Card> {
    return (await this.httpClient
      .put(`/api/card/${cardToEdit.id}`, value)
      .toPromise()) as Card;
  }

  async deleteCard(card: Card): Promise<void> {
    await this.httpClient.delete(`/api/card/${card.id}`).toPromise();
  }
}
