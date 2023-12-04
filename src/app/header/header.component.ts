import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {User} from "../account/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  menuSwitcher: boolean = false;
  links: {name: string, src: string, role: string}[] = [
    {name: 'Про нас', src: 'about', role: 'USER'},
    {name: 'Послуги', src: 'categories', role: 'USER'}
  ];
  accessLinks: {name: string, src: string, role: string}[] = [
    {name: 'Акаунт', src: 'account/midi_coat', role: 'CLIENT'},
    {name: 'Замовлення', src: 'orders/pending', role: 'EMPLOYEE'},
    {name: 'Працiвники', src: 'employees', role: 'ADMIN'}
  ]
  user: User;
  userSub: Subscription;
  allRoles: string[];
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.allRoles = this.authService.getAllRoles();
    this.user = this.authService.getUser();
    this.userSub = this.authService.getUserListener().subscribe(user => {
      this.user = user;
      if(user.isAuth) return this.onAuth();
    })
    this.onAuth();
  }
  closeMenu() {
    this.menuSwitcher = false;
  }

  isActive(url: any) {
    return this.router.url.includes(url);
  }

  onLogout() {
    this.closeMenu();
    this.links = this.links.filter(link => link.role === 'USER');
    this.authService.logout();
  }

  private onAuth() {
    this.user.roles!.forEach(role => {
      let link = this.accessLinks.find(accessLink => accessLink.role === role);
      if (link) this.links.push(link);
    })
  }

  protected readonly window = window;
}
