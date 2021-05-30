import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Deck } from '../domain/deck';

@Injectable({
  providedIn: 'root',
})
export class DeckService {
  constructor(private httpClient: HttpClient) {}

  async getDecks(): Promise<Deck[]> {
    return (await this.httpClient.get('/api/deck').toPromise()) as Deck[];
  }

  async getDeck(deckId: number): Promise<Deck> {
    return (await this.httpClient
      .get(`/api/deck/${deckId}`)
      .toPromise()) as Deck;
  }

  async createDeck(deck: Deck): Promise<Deck> {
    return (await this.httpClient
      .post('/api/deck', deck)
      .toPromise()) as Deck;
  }

  async editDeck(deckToEdit: Deck, value: Deck): Promise<Deck> {
    return (await this.httpClient
      .put(`/api/deck/${deckToEdit.id}`, value)
      .toPromise()) as Deck;
  }

  async deleteDeck(deck: Deck): Promise<void> {
    await this.httpClient.delete(`/api/deck/${deck.id}`).toPromise();
  }

  async favoriteDeck(deck: Deck): Promise<void> {
    await this.httpClient.post(`/api/deck/favorite/${deck.id}`, "").toPromise();
  }

  async unfavoriteDeck(deck: Deck): Promise<void> {
    await this.httpClient.post(`/api/deck/unfavorite/${deck.id}`, "").toPromise();
  }
}
