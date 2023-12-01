import {Component} from '@angular/core';
import {NgForm} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {OrdersService} from "../../account/orders/orders.service";
import {NewCustomer} from "../../account/orders/new-customer.model";

@Component({
  selector: 'app-dialog-data',
  templateUrl: './dialog-data.component.html',
  styleUrl: './dialog-data.component.scss'
})
export class DialogDataComponent {
  newCustomer: NewCustomer = {
    lastName: "",
    firstName: "",
    email: ""
  }
  constructor(private ordersService: OrdersService, public dialogRef: MatDialogRef<DialogDataComponent>) {}
  onSendClientForm(form: NgForm) {
    if(form.invalid) return;
    this.ordersService.createNewCustomer(this.newCustomer);
    this.dialogRef.close();
  }
}
