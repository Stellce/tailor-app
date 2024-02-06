import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.scss'
})
export class RecoverPasswordComponent implements OnInit{
  protected token: string;
  protected hide1: boolean = true;
  protected hide2: boolean = true;
  constructor(protected authService: AuthService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.token = this.activatedRoute.snapshot.params['token'];
    // this.authService.setToken(this.token);
  }

  onRecover(f: NgForm) {
    if(f.invalid) return;
    this.authService.recover(f.controls['email'].value);
  }

  onPasswordChange(f: NgForm) {
    console.log(f);
    if(f.invalid) return;
    console.log(f)
    this.authService.passwordChange(f.controls['password'].value, this.token);
  }
}
