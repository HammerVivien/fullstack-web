import { Component, OnInit, ViewChild } from '@angular/core';
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
import { CardService } from '../core/card.service';


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

  constructor(private fb: FormBuilder, private cardService: CardService) {}

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

  }

  ngOnChanges(): void {

  }

  async submit(): Promise<void> {
    console.log(this.cardForm.valid);

    const nonMonsterValid = this.type.value != "Monster" && this.name.valid;
    if (this.cardForm.valid || nonMonsterValid) {
      if (!this.cardForm.valid) {
        this.level.setValue(null);
        this.attack.setValue(null);
        this.defense.setValue(null);
        this.race.setValue(null);
        this.attribute.setValue(null);
      }
      await this.cardService.createCard(this.cardForm.value);
      window.location.reload();
    }
  }

}
