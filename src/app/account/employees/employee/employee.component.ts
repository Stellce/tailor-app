import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../auth/auth.service";
import {User} from "../../user.model";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {EmployeesService} from "../employees.service";
import {Employee} from "./employee.model";
import {TranslatorService} from "../translator.service";
import {Field} from "../field.model";
import {YesNoDialogComponent} from "../../yes-no-dialog/yes-no-dialog.component";
import {MatDialog} from "@angular/material/dialog";

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
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private employeesService: EmployeesService,
    private translator: TranslatorService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
    this.userSub = this.authService.getUserListener().subscribe(user => {
      this.user = user;
    });
    this.activatedRoute.params.subscribe(params => {
      this.employeeId = params['employeeId'];
      this.employeesService.getAllEmployees();
      this.isLoading = true;
    })
    this.employeesSub = this.employeesService.getEmployeesListener().subscribe(employees => {
      this.isLoading = false;
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
    const dialogRef = this.dialog.open(YesNoDialogComponent, {data: {message: 'Видалити робiтника?'}})
    dialogRef.afterClosed().subscribe(res => {
      if(res.event === 'Yes') {
        this.employeesService.deleteEmployee(this.employee.id!);
        this.router.navigate(['./'], {relativeTo: this.activatedRoute.parent});
      }
    })
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.employeesSub.unsubscribe();
  }

  protected readonly Object = Object;
}
