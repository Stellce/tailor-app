import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent {
  activationDonePath: string = './assets/activation-done.svg';
  activationFailedPath: string = './assets/activation-failed.svg';
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string, isSuccessful: boolean}) {
    console.log(data)
  }
}
