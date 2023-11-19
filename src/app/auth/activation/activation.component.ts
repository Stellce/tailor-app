import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit{
  activationDonePath: string = './assets/activation-done.svg';
  activationFailedPath: string = './assets/activation-failed.svg';
  isActivated: boolean;
  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute) {
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.authService.activateAccount(params['id']);
    })
    this.authService.authStatusListener.subscribe(status => {
      this.isActivated = status;
    })
  }
}
