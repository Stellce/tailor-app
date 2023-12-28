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
  hide1: boolean = true;
  hide2: boolean = true;
  user: Customer;
  authStatusSub: Subscription;
  isLoading: boolean;
  isLoadingSub: Subscription;
  isRegistering: boolean = false;
  leftSecondsToRepeatEmail: number;
  leftSecondsToRepeatEmailInterval: any;
  isRegistered: boolean;
  isRegisteredSub: Subscription;
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.isLoading = this.authService.getIsLoading();
    this.isRegistered = this.authService.getIsRegistered();
    this.authStatusSub = this.authService.getUserListener().subscribe({
      next: () => {},
      error: () => {},
      complete: () => this.isLoading = false
    })
    this.isLoadingSub = this.authService.getIsLoadingListener().subscribe(isLoading => {
      this.isLoading = isLoading
    });
    this.isRegisteredSub = this.authService.getIsRegisteredListener().subscribe(isRegistered => this.isRegistered = isRegistered);
  }

  onRegister(form: NgForm) {
    if(form.invalid) return;
    this.isRegistering = true;
    this.leftSecondsToRepeatEmail = 5;
    this.leftSecondsToRepeatEmailInterval = setInterval(() => {
      if(this.leftSecondsToRepeatEmail <= 0) {
        clearInterval(this.leftSecondsToRepeatEmailInterval);
      }
      this.leftSecondsToRepeatEmail -= 1;
    }, 1000);
    this.isLoading = true;
    let formValues = {...form.value}
    delete formValues.passwordRepeat;
    this.user = {...formValues};
    !this.isRegistered ?
      this.authService.register(this.user) :
      this.authService.repeatEmail(this.user);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
