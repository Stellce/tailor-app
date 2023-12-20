import {Component, OnDestroy, OnInit} from '@angular/core';
import {Employee} from "./employee/employee.model";
import {Subscription} from "rxjs";
import {EmployeesService} from "./employees.service";
import {AppService} from "../../app.service";

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit, OnDestroy{
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'phoneNumber', 'registeredAt'];
  employees: Employee[];
  employeesSub: Subscription;

  constructor(private employeesService: EmployeesService, private appService: AppService) {}
  ngOnInit() {
    this.employees = this.employeesService.getEmployees();
    this.employeesSub = this.employeesService.getEmployeesListener().subscribe(employees => {
      this.employees = employees.map(employee => {
        employee.registeredAt = this.appService.fixDateStr(employee.registeredAt);
        return employee;
      });
    })
    this.employeesService.getAllEmployees();
  }
  ngOnDestroy() {
    this.employeesSub.unsubscribe();
  }
}
