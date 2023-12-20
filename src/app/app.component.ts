import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {NavigationStart, Router} from "@angular/router";
import {AppService} from "./app.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'tailor-app';
  isSemiTranspared: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private appService: AppService
    ) {}
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationStart) {
        this.isSemiTranspared = event.url === '/about' || event.url === '';
      }
      this.appService.changeHeaderListener(this.isSemiTranspared);
    })
    this.authService.autoAuthUser();
  }
}
