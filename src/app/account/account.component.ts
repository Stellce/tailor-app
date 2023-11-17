import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from "./account.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserDetails} from "./user-details.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy{
  userDetails: UserDetails;
  userDetailsSub: Subscription;
  newAddress: {name: string, text: string, oldValue?: string}[] = [
    {name: 'city', text: 'Мiсто'},
    {name: 'street', text: 'Вулиця'},
    {name: 'buildingNumber', text: 'Номер будинку'},
    {name: 'apartmentNumber', text: 'Номер квартири'},
    {name: 'zipCode', text: 'Поштовий код'}
  ]
  userForm: FormGroup;
  isLoading: boolean = false;
  phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
  constructor(private accountService: AccountService) {}
  ngOnInit() {
    this.userForm = new FormGroup({
      birthDate: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      address: new FormGroup({
        city: new FormControl('', Validators.required),
        street: new FormControl('', Validators.required),
        buildingNumber: new FormControl('', Validators.required),
        apartmentNumber: new FormControl(''),
        zipCode: new FormControl('', Validators.required)
      })
    })
    this.userDetailsSub = this.accountService.getUserDetailsListener().subscribe({
      next: userDetails => {
        this.userDetails = userDetails;
        if(userDetails.phoneNumber)this.userDetails.phoneNumber = String(this.userDetails?.phoneNumber).replace(/-/g, "");
        // console.log(userDetails);
        let newUserDetails: any = {...userDetails};
        this.newAddress.map(el => el.oldValue = newUserDetails.address[el.name]);
        this.userForm.setValue({
          birthDate: this.userDetails.birthDate,
          phoneNumber: this.userDetails.phoneNumber,
          address: {
            city: this.userDetails.address.city,
            street: this.userDetails.address.street,
            buildingNumber: this.userDetails.address.buildingNumber,
            apartmentNumber: this.userDetails.address.apartmentNumber,
            zipCode: this.userDetails.address.zipCode
          }
        })
        this.isLoading = false
      },
      error: err => {
        this.isLoading = false;
        console.log(err);
        console.log('Achtung!')
      },
      complete: () => {

      }
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
  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
    // nestedElement.scrollTo(0, nestedElement.scrollHeight);
  }

  ngOnDestroy() {
    this.userDetailsSub.unsubscribe();
  }

  protected readonly Object = Object;
  protected readonly String = String;
}
