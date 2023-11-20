import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Customer} from "../customer.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy{
  hide: boolean = true;
  authStatusSub: Subscription;
  isLoading: boolean = false;
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      () => this.isLoading = false
    )
  }

  onLogin(form: NgForm) {
    if(form.invalid) return;
    this.isLoading = true;
    let user: Customer = form.value;
    this.authService.login(user);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
