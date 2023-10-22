import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tailor-app';
  footerContent: {name: string, src: string}[] = [
    {name: 'Контакти', src: 'contacts'},
    {name: 'Адреса', src: 'address'}
  ]
}
