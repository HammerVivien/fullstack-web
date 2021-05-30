import { Component, OnInit } from '@angular/core';
import { CardService } from '../core/card.service';
import { Card } from '../domain/card';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  cards!: Card[];

  constructor(
    private cardService: CardService
    ) { }

  async ngOnInit(): Promise<void> {
    this.cards = await this.cardService.getCards();
  }

}
