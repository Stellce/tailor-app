import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  menuSwitcher: boolean = false;
  links: {name: string, src: string}[] = [
    {name: 'Про нас', src: 'about'},
    {name: 'Послуги', src: 'categories'},
    {name: 'Ціни', src: 'prices'}
  ];
  isAuth: boolean = false;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.authStatusListener.subscribe(isAuth => {
      this.isAuth = isAuth;
    })
  }

  getIsAuth(): boolean {
    return this.authService.getIsAuth();
  }

  onLogout() {
    this.authService.logout();
  }

  protected readonly window = window;
}
