import {Component, OnInit} from '@angular/core';
import {AccountService} from "./account.service";
import {FormControl, FormGroup, NgForm, PatternValidator, Validators} from "@angular/forms";
import {UserDetails} from "./user-details.model";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit{
  userDetails: UserDetails;
  address: {name: string, text: string, oldValue?: string}[] = [
    {name: 'city', text: 'Мiсто'},
    {name: 'street', text: 'Вулиця'},
    {name: 'buildingNumber', text: 'Номер будинку'},
    {name: 'apartmentNumber', text: 'Номер квартири'},
    {name: 'zipCode', text: 'Поштовий код'}
  ]
  birthDate: Date;
  userForm: FormGroup;
  phoneNumber: number;
  phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  constructor(private accountService: AccountService) {}
  ngOnInit() {
    this.accountService.getUserDetailsListener().subscribe(userDetails => {
      this.userDetails = userDetails;
      console.log(userDetails);
      let newUserDetails: any = {...userDetails};
      this.address.map(el => el.oldValue = newUserDetails.address[el.name]);

    })
    this.accountService.getUserDetails();
    this.userForm = new FormGroup({
      birthDate: new FormControl(this.userDetails.birthDate || '', Validators.required),
      phoneNumber: new FormControl(this.userDetails.phoneNumber || '', Validators.required),
      address: new FormGroup({
        city: new FormControl(this.userDetails.address.city || '', Validators.required),
        street: new FormControl(this.userDetails.address.street || '', Validators.required),
        buildingNumber: new FormControl(this.userDetails.address.buildingNumber || '', Validators.required),
        apartmentNumber: new FormControl(this.userDetails.address.apartmentNumber || ''),
        zipCode: new FormControl(this.userDetails.address.zipCode || '', Validators.required)
      })
    })
  }

  onSubmit(f: NgForm) {
    if(f.invalid) return;
    console.log(this.birthDate.getTime());
    let userDetails: UserDetails = {
      birthDate: this.birthDate.toISOString().split('T')[0],
      phoneNumber: String(this.phoneNumber),
      address: {
        city: f.form.controls['city'].value,
        street: f.form.controls['street'].value,
        buildingNumber: f.form.controls['buildingNumber'].value,
        apartmentNumber: f.form.controls['apartmentNumber'].value,
        zipCode: f.form.controls['zipCode'].value
      }
    }
    this.userDetails ?
      this.accountService.updateUserDetails(userDetails) :
      this.accountService.postUserDetails(userDetails);
  }

  protected readonly Object = Object;
  protected readonly String = String;
}
