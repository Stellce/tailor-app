import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  menuSwitcher: boolean = false;
  links: {name: string, src: string}[] = [
    {name: 'Про нас', src: 'about'},
    {name: 'Послуги', src: 'categories'},
    {name: 'Цiни', src: 'prices'}
  ];

  protected readonly window = window;
}
