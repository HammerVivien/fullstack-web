import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { CardService } from '../core/card.service';
import { DeckService } from '../core/deck.service';
import { Card } from '../domain/card';
import { Deck } from '../domain/deck';
import { User } from '../domain/user';

@Component({
  selector: 'app-deck-details',
  templateUrl: './deck-details.component.html',
  styleUrls: ['./deck-details.component.scss']
})
export class DeckDetailsComponent implements OnInit {

  cards!: Card[];
  deck: Deck;
  deckCardIds: number[];


  get deckCards() : Card[] {
    if (this.cards == null)
      return [];
    return this.deckCardIds.map((id) => this.cards.find((card) => card.id == id));
  }

  get isLoggedIn() : boolean {
    return this.auth.isLoggedIn;
  }

  get isFavorited() : boolean {
    return this.deck.favorites.findIndex((u) => u == this.auth.user.id) >= 0;
  }

  constructor(
    private deckService: DeckService,
    private cardService: CardService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService) { }


  async ngOnInit(): Promise<void> {
    await this.updateDeck();
  }

  async favorite() : Promise<void> {
    if (this.isFavorited) {
      this.deckService.unfavoriteDeck(this.deck);
    } else {
      this.deckService.favoriteDeck(this.deck);
    }
    this.updateDeck();
  }

  private async updateDeck() : Promise<void> {
    const deckId = parseInt(this.route.snapshot.paramMap.get('deckId') as string);
    this.deck = await this.deckService.getDeck(deckId);
    this.cards = await this.cardService.getCards();
    this.deckCardIds = this.deck.cards;
  }
}
