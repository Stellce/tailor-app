import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.scss'
})
export class RecoverPasswordComponent implements OnInit{
  token: string;
  hide1: boolean = true;
  hide2: boolean = true;
  constructor(protected authService: AuthService) {}

  ngOnInit() {
    this.token = this.authService.getToken();
  }

  onRecover(f: NgForm) {
    if(f.invalid) return;
    this.authService.recover(f.controls['email'].value);
  }

  onPasswordChange(f: NgForm) {
    if(f.invalid) return;
    this.authService.passwordChange(f.controls['password'].value);
  }
}
