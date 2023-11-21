import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Customer} from "../customer.model";
import {AuthService} from "../auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy{
  hide: boolean = true;
  user: Customer;
  authStatusSub: Subscription;
  isLoading: boolean = false;
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.authStatusSub = this.authService.getUserListener().subscribe({
      next: () => {},
      error: () => {},
      complete: () => this.isLoading = false
    })
  }

  onRegister(form: NgForm) {
    if(form.invalid) return;
    this.isLoading = true;
    let formValues = {...form.value}
    delete formValues.passwordRepeat;
    this.user = {...formValues}
    this.authService.register(this.user);
    console.log(form);
    console.log(this.user);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
