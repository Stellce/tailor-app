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
  newAddress: {name: string, text: string, oldValue?: string}[] = [
    {name: 'city', text: 'Мiсто'},
    {name: 'street', text: 'Вулиця'},
    {name: 'buildingNumber', text: 'Номер будинку'},
    {name: 'apartmentNumber', text: 'Номер квартири'},
    {name: 'zipCode', text: 'Поштовий код'}
  ]
  userForm: FormGroup;
  isLoading: boolean = true;
  phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  constructor(private accountService: AccountService) {}
  ngOnInit() {
    this.accountService.getUserDetailsListener().subscribe(userDetails => {
      this.userDetails = userDetails;
      console.log(userDetails);
      let newUserDetails: any = {...userDetails};
      this.newAddress.map(el => el.oldValue = newUserDetails.address[el.name]);

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
      this.isLoading = false
    })
    this.accountService.getUserDetails();
  }

  onSubmit() {
    console.log(this.userForm);
    if(this.userForm.invalid) return;
    console.log('valid')

    let userDetails: UserDetails = {
      birthDate: this.userForm.controls['birthDate'].value,
      phoneNumber: this.userForm.controls['phoneNumber'].value,
      address: {
        city: (this.userForm.get('address') as FormGroup).controls['city'].value,
        street: (this.userForm.get('address') as FormGroup).controls['street'].value,
        buildingNumber: (this.userForm.get('address') as FormGroup).controls['buildingNumber'].value,
        apartmentNumber: (this.userForm.get('address') as FormGroup).controls['apartmentNumber'].value,
        zipCode: (this.userForm.get('address') as FormGroup).controls['zipCode'].value
      }
    }
    this.userDetails ?
      this.accountService.updateUserDetails(userDetails) :
      this.accountService.postUserDetails(userDetails);
  }

  protected readonly Object = Object;
  protected readonly String = String;
}
