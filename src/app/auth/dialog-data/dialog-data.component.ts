import {Component} from '@angular/core';
import {NgForm} from "@angular/forms";
import {CalculatorService} from "../../categories/category/calculator/calculator.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-data',
  templateUrl: './dialog-data.component.html',
  styleUrl: './dialog-data.component.scss'
})
export class DialogDataComponent {
  constructor(private calcService: CalculatorService, public dialogRef: MatDialogRef<DialogDataComponent>) {
  }
  onSendClientForm(form: NgForm) {
    if(form.invalid) return;
    // let userData = form.controls.map
    // this.calcService.setUserData(form.controls)
    console.log(form)
    this.dialogRef.close();
  }
}
