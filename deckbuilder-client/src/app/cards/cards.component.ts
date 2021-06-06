import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CardEditorComponent } from '../card-editor/card-editor.component';
import { AuthService } from '../core/auth.service';
import { CardService } from '../core/card.service';
import { Card } from '../domain/card';
import { User, UserRole } from '../domain/user';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  cards!: Promise<Card[]>;
  isAdmin: boolean;

  constructor(
    private cardService: CardService,
    private auth: AuthService,
    private dialog: MatDialog,
    ) { }

  async ngOnInit(): Promise<void> {
    this.getCards();
    this.isAdmin = this.auth.isAdmin;
    console.log(this.isAdmin);
  }


  async deleteCard(card: Card) : Promise<void> {
    await this.cardService.deleteCard(card);
    this.getCards();
  }

  async openCardDialog(card?: Card) : Promise<void> {
    const dialogRef = this.dialog.open(CardEditorComponent, {
      data: card
    });

    await dialogRef.afterClosed().toPromise();
    this.getCards();
  }

  private getCards(): void {
    this.cards = this.cardService.getCards();
  }


}
