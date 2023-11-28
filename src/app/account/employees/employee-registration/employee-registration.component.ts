import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {Employee} from "../employee/employee.model";
import {EmployeesService} from "../employees.service";

@Component({
  selector: 'app-employee-registration',
  templateUrl: './employee-registration.component.html',
  styleUrl: './employee-registration.component.scss'
})
export class EmployeeRegistrationComponent {
  hide: boolean = true;
  constructor(private employeesService: EmployeesService) {}
  onRegisterEmployee(f: NgForm) {
    let newEmployee: Employee = {
      firstName: f.controls['firstName'].value,
      lastName: f.controls['lastName'].value,
      email: f.controls['email'].value,
      phoneNumber: f.controls['phoneNumber'].value,
      password: f.controls['password'].value
    }
    this.employeesService.registerEmployee(newEmployee);
    this.employeesService.getAllEmployees();
  }
}
