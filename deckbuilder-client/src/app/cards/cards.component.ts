import { Component, OnInit } from '@angular/core';
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

  cards!: Card[];
  isAdmin: boolean;

  constructor(
    private cardService: CardService,
    private auth: AuthService,
    ) { }

  async ngOnInit(): Promise<void> {
    this.cards = await this.cardService.getCards();
    this.isAdmin = this.auth.isAdmin;
    console.log(this.isAdmin);

  }



}
