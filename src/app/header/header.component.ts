import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
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
  user: User;
  userSub: Subscription;
  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.userSub = this.authService.getUserListener().subscribe(user => {
      this.user = user;
      this.onAuth();
    })
    this.onAuth();
  }

  private onAuth() {
    if(this.user.roles?.includes('CLIENT') && !this.links.some(link => link.src === 'account/midi_coat')) {
      this.links.push({name: 'Акаунт', src: 'account/midi_coat'});
      this.links.push({name: 'Замовлення', src: 'orders/pending'})
    } else {
      this.links = this.links.filter(link => link.src !== 'account/midi_coat');
      this.links = this.links.filter(link => link.src !== 'orders/pending')
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
