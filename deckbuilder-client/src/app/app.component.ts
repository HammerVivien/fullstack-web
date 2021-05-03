import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Deckbuilder-client';

  clicked(e : any): void {
    console.log(e);
  }
}
