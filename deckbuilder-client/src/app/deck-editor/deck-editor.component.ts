import { Component, Inject, OnInit, Optional } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CardPickerComponent } from '../card-picker/card-picker.component';
import { AuthService } from '../core/auth.service';
import { CardService } from '../core/card.service';
import { DeckService } from '../core/deck.service';
import { Card } from '../domain/card';
import { Deck } from '../domain/deck';

@Component({
  selector: 'app-deck-editor',
  templateUrl: './deck-editor.component.html',
  styleUrls: ['./deck-editor.component.scss'],
})
export class DeckEditorComponent implements OnInit {
  deckForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    isPublic: [''],
  });
  deckToEdit?: Deck;
  cards: Card[];
  deckCardIds: number[];

  get deckCards() {
    if (this.cards == null)
      return [];
    return this.deckCardIds.map((id) => this.cards.find((card) => card.id == id));
  }

  get name(): FormControl {
    return this.deckForm.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.deckForm.get('description') as FormControl;
  }

  get isPublic(): FormControl {
    return this.deckForm.get('isPublic') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private deckService: DeckService,
    private cardService: CardService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog) {}

  async ngOnInit(): Promise<void> {
    await this.getCards();
    const deckId = this.route.snapshot.paramMap.get('deckId') as string
    this.deckCardIds = [];
    if (deckId != "new") {
      this.deckToEdit = await this.deckService.getDeck(parseInt(deckId));
      console.log(this.deckToEdit);

      this.deckCardIds = this.deckToEdit.cards;
      this.name.setValue(this.deckToEdit.name);
      this.description.setValue(this.deckToEdit.description);
      this.isPublic.setValue(this.deckToEdit.isPublic);
    } else {
      this.deckCardIds = [];
    }
  }

  async submit(): Promise<void> {
    this.deckForm.markAllAsTouched();
    if (this.deckForm.valid) {
      const newDeck = {...this.deckForm.value, cards: this.deckCardIds};
      console.log(newDeck);
      console.log(this.deckToEdit);

      if (this.deckToEdit) {
        await this.deckService.editDeck(this.deckToEdit, newDeck);
      } else {
        await this.deckService.createDeck(newDeck);
      }
      this.router.navigate(["/", "decks"]);

    }
  }

  async deleteDeck(): Promise<void> {
    this.router.navigate(["/", "decks"]);
    await this.deckService.deleteDeck(this.deckToEdit);
  }

  addCard(card: Card): void {
    this.deckCardIds.push(card.id);
  }

  removeCard(index: number): void {
    console.log(index);
    this.deckCardIds.splice(index, 1);
  }

  async getCards(): Promise<void> {
    this.cards = await this.cardService.getCards();
  }

  async openCardDialog(): Promise<void> {
    const dialogRef = this.dialog.open(CardPickerComponent, {
      height: '400px',
      data: this.deckCardIds
    });

    await dialogRef.afterClosed().toPromise();
  }


}
