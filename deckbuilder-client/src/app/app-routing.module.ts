import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardsComponent } from './cards/cards.component';
import { DeckDetailsComponent } from './deck-details/deck-details.component';
import { DeckEditorComponent } from './deck-editor/deck-editor.component';
import { DecksComponent } from './decks/decks.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [{
  path: 'cards',
  component: CardsComponent,
}, {
  path: 'decks',
  component: DecksComponent,
}, {
  path: 'decks/:deckId',
  component: DeckDetailsComponent
}, {
  path: 'decks/:deckId/edit',
  component: DeckEditorComponent
},{
  path: 'login',
  component: LoginComponent,
}, {
  path: 'register',
  component: RegisterComponent,
}, {
  path: '**',
  redirectTo: '/cards'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
