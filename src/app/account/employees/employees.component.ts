import {Component, OnDestroy, OnInit} from '@angular/core';
import {Employee} from "./employee/employee.model";
import {Subscription} from "rxjs";
import {EmployeesService} from "./employees.service";

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit, OnDestroy{
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'phoneNumber', 'registeredAt'];
  employees: Employee[];
  employeesSub: Subscription;

  constructor(private employeesService: EmployeesService) {}
  ngOnInit() {
    this.employees = this.employeesService.getEmployees();
    this.employeesSub = this.employeesService.getEmployeesListener().subscribe(employees => {
      this.employees = employees;
    })
    this.employeesService.getAllEmployees();
  }
  ngOnDestroy() {
    this.employeesSub.unsubscribe();
  }
}
