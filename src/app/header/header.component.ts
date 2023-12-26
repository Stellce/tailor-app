import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {User} from "../account/user.model";
import {AppService} from "../app.service";
import {CategoriesService} from "../services/categories/categories.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  protected logoPath: string = './assets/logoW.svg'
  protected menuSwitcher: boolean = false;
  protected links: {name: string, src: string[], role: string}[] = [
    {name: 'Про нас', src: ['about'], role: 'USER'},
    {name: 'Каталог', src: ['categories'], role: 'USER'}
  ];
  private accessLinks: {name: string, src: string[], role: string}[] = [
    {name: 'Акаунт', src: ['account'], role: 'CLIENT'},
    {name: 'Замовлення', src: ['orders', 'pending'], role: 'EMPLOYEE'},
    {name: 'Працiвники', src: ['employees'], role: 'ADMIN'}
  ]
  protected user: User;
  private userSub: Subscription;
  protected changeHeader: boolean;
  private selectedCategoryName: string;
  constructor(
    private authService: AuthService,
    private router: Router,
    private appService: AppService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.userSub = this.authService.getUserListener().subscribe(user => {
      this.user = user;
      if(user.isAuth) return this.onAuth();
    })
    this.onAuth();
    this.changeHeader = this.appService.getDoChangeHeader();
    this.appService.getDoChangeHeaderListener().subscribe(doChange => {
      this.changeHeader = doChange;
    })
    this.categoriesService.getSelectedCategoryNameListener().subscribe(categoryName => {
      categoryName = categoryName.toLowerCase();
      this.selectedCategoryName = categoryName;
      this.links.find(link => link.src.includes('categories')).src = ['categories', categoryName];
    });
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
      let link = this.accessLinks.find(accessLink =>
        accessLink.role === role && !this.links.some(link => link.role === role));
      if (link) this.links.push(link);
    })
  }

  protected readonly window = window;
}
