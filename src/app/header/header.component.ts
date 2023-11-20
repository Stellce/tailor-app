import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Subject, Subscription} from "rxjs";
import {ActivatedRoute, Router, UrlSegment} from "@angular/router";
import {Customer} from "../auth/customer.model";
import {User} from "../account/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  menuSwitcher: boolean = false;
  links: {name: string, src: string}[] = [
    {name: 'Про нас', src: 'about'},
    {name: 'Послуги', src: 'categories'}
  ];
  isAuth: boolean;
  isAuthSub: Subscription;
  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.isAuth = this.authService.getUser();
    this.isAuthSub = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.isAuth = isAuth;
      this.onAuth();
    })
    this.onAuth();
  }

  private onAuth() {
    if(this.isAuth && !this.links.find(link => link.src === 'account/midi_coat')) {
      this.links.push({name: 'Акаунт', src: 'account/midi_coat'});
    } else {
      this.links = this.links.filter(link => link.src !== 'account/midi_coat');
    }
  }

  isActive(url: any) {
    return this.router.url.includes(url);
  }

  onLogout() {
    this.authService.logout();
  }

  protected readonly window = window;
}
