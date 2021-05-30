import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
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
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
  });

  constructor(private fb: FormBuilder, private cardService: CardService) {}

  get name(): FormControl {
    return this.cardForm.get('name') as FormControl;
  }


  ngOnInit(): void {
  }

  submit(): void {
    if (this.cardForm.valid) {
      this.cardService.createCard(this.cardForm.value);
      // then go to issue list
    }
  }

}
