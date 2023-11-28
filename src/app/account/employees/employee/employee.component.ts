import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../auth/auth.service";
import {User} from "../../user.model";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {EmployeesService} from "../employees.service";
import {Employee} from "./employee.model";
import {TranslatorService} from "../translator.service";
import {Field} from "../field.model";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit, OnDestroy{
  user: User;
  userSub: Subscription;
  employee: Employee;
  employeesSub: Subscription;
  employeeFields: Field[];
  employeeId: string;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private employeesService: EmployeesService,
    private translator: TranslatorService,
    private router: Router
  ) {}
  ngOnInit() {
    this.userSub = this.authService.getUserListener().subscribe(user => {
      this.user = user;
    });
    this.activatedRoute.params.subscribe(params => {
      console.log(params)
      this.employeeId = params['employeeId'];
    })

    this.employeesSub = this.employeesService.getEmployeesListener().subscribe(employees => {
      console.log(employees)
      console.log(employees.find(e => (e.id as string) == this.employeeId));
      this.employee = employees.find(employee => (employee.id as string) == this.employeeId)!;
      this.castEmployeeToFields();
    })
    this.employeesService.getAllEmployees();
  }

  castEmployeeToFields() {
    if(!this.employee) return;
    this.employeeFields = <Field[]> [];
    for (let [fieldName, fieldValue] of Object.entries(this.employee)) {
      if(fieldName === 'id') continue;
      let fieldNameTranslation = this.translator.translate(fieldName);
      this.employeeFields.push({
        fieldName: fieldName,
        fieldNameTranslation: fieldNameTranslation,
        fieldValue: fieldValue});
    }
  }

  onDeleteEmployee() {
    this.employeesService.deleteEmployee(this.employee.id!);
    this.router.navigate(['./'], {relativeTo: this.activatedRoute.parent});
    this.employeesService.getAllEmployees();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.employeesSub.unsubscribe();
  }

  protected readonly Object = Object;
}
