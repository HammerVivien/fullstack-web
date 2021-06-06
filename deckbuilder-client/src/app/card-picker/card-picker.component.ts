import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { CardService } from '../core/card.service';
import { Card } from '../domain/card';

@Component({
  selector: 'app-card-picker',
  templateUrl: './card-picker.component.html',
  styleUrls: ['./card-picker.component.scss']
})
export class CardPickerComponent implements OnInit {
  cards: Card[];
  card: Card[];

  constructor(
    private cardService: CardService,
    @Optional() public dialogRef?: MatDialogRef<CardPickerComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() private deckCards?: number[]
  ) {}

  async ngOnInit(): Promise<void> {
    this.cards = await this.cardService.getCards();
  }


  onSelectValueChange(): void {
    this.deckCards.push(this.card[0].id);
    this.dialogRef.close();
  }
}
