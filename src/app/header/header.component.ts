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
  isAuth: boolean;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAuth = this.authService.getIsAuth();
    this.authService.getAuthStatusListener().subscribe(isAuth => {
      console.log(isAuth)
      this.isAuth = isAuth;
    })
  }

  onLogout() {
    this.authService.logout();
  }

  protected readonly window = window;
}
