import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CardService } from '../core/card.service';
import { Card } from '../domain/card';


@Component({
  selector: 'app-card-editor',
  templateUrl: './card-editor.component.html',
  styleUrls: ['./card-editor.component.scss']
})
export class CardEditorComponent implements OnInit {

  cardForm: FormGroup = this.fb.group({
    name:        ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    type:      ['Monster', Validators.required],
    subType:   ['', Validators.required],
    level:     ['', Validators.required],
    attack:    ['', Validators.required],
    defense:   ['', Validators.required],
    race:      ['', Validators.required],
    attribute: ['', Validators.required],
  });

  get isNewCard(): boolean {
    return this.cardToEdit == null;
  }

  constructor(
    private fb: FormBuilder,
    private cardService: CardService,
    @Optional() public dialogRef?: MatDialogRef<CardEditorComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() private cardToEdit?: Card
  ) {}

  get name(): FormControl {
    return this.cardForm.get('name') as FormControl;
  }
  get type(): FormControl {
    return this.cardForm.get('type') as FormControl;
  }
  get subType(): FormControl {
    return this.cardForm.get('subType') as FormControl;
  }
  get level(): FormControl {
    return this.cardForm.get('level') as FormControl;
  }
  get attack(): FormControl {
    return this.cardForm.get('attack') as FormControl;
  }
  get defense(): FormControl {
    return this.cardForm.get('defense') as FormControl;
  }
  get race(): FormControl {
    return this.cardForm.get('race') as FormControl;
  }
  get attribute(): FormControl {
    return this.cardForm.get('attribute') as FormControl;
  }

  ngOnInit(): void {
    if (this.cardToEdit) {
      this.cardForm.reset({
        name: this.cardToEdit.name,
        description: this.cardToEdit.description,
        type: this.cardToEdit.type,
        subType: this.cardToEdit.subType,
        attribute: this.cardToEdit.attribute,
        attack: this.cardToEdit.attack,
        defense: this.cardToEdit.defense,
        level: this.cardToEdit.level,
        race: this.cardToEdit.race,
      })
    }
  }

  async submit(): Promise<void> {
    this.cardForm.markAllAsTouched();

    const nonMonsterValid = this.type.value != "Monster" && this.name.valid;
    if (this.cardForm.valid || nonMonsterValid) {
      if (!this.cardForm.valid) {
        this.level.setValue(null);
        this.attack.setValue(null);
        this.defense.setValue(null);
        this.race.setValue(null);
        this.attribute.setValue(null);
      }
      if (this.cardToEdit) {
        await this.cardService.editCard(this.cardToEdit, this.cardForm.value);
      } else {
        await this.cardService.createCard(this.cardForm.value);
      }
      window.location.reload();
    }
  }

}
