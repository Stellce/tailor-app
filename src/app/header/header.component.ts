import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";

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
  isAuthSub: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAuth = this.authService.getIsAuth();
    this.isAuthSub = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.isAuth = isAuth;
      this.onAuth();
    })
    this.onAuth();
  }

  private onAuth() {
    if(this.isAuth) {
      this.links.push({name: 'Акаунт', src: 'account'});
      console.log('yes')
    } else {
      this.links = this.links.filter(link => link.src !== 'account');
      console.log('no')
    }
  }

  onLogout() {
    this.authService.logout();
  }

  protected readonly window = window;
}
