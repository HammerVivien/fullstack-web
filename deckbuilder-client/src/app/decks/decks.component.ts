import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { DeckService } from '../core/deck.service';
import { Deck } from '../domain/deck';
import { MatDialog } from '@angular/material/dialog';
import { DeckEditorComponent } from '../deck-editor/deck-editor.component';

@Component({
  selector: 'app-deck',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss']
})
export class DecksComponent implements OnInit {

  decks!: Deck[];
  userDecks: Deck[] | null;
  isLoggedIn : boolean;

  constructor(
    private deckService: DeckService,
    private auth: AuthService) { }

  async ngOnInit(): Promise<void> {
    await this.getDecks();
    this.isLoggedIn = this.auth.isLoggedIn;
    if (this.auth.isLoggedIn)
      await this.getUserDecks()
  }

  private async getDecks(): Promise<void> {
    this.decks = await this.deckService.getDecks();
  }

  private async getUserDecks(): Promise<void> {
    this.userDecks = this.decks.filter((deck) => deck.user == this.auth.user?.id);
  }


}
