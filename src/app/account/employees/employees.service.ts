import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Employee} from "./employee/employee.model";
import {Subject} from "rxjs";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../auth/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../../auth/error-dialog/error-dialog.component";
@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  backendUrl = environment.backendUrl;
  employees: Employee[];
  employeesListener = new Subject<Employee[]>();

  constructor(private http: HttpClient, private authService: AuthService, private dialog: MatDialog) {}

  getEmployees() {
    return this.employees;
  }
  getEmployeesListener() {
    return this.employeesListener.asObservable();
  }
  getAllEmployees() {
    this.http.get<Employee[]>(`${this.backendUrl}/employees`, {headers: this.authService.getTokenHeader()}).subscribe({
      next: (employees) => {
        this.employees = employees;
        this.employeesListener.next(employees);
      },
      error: (err) => {
        console.log(err);
        this.dialog.open(ErrorDialogComponent, {data: {message: 'Bad attempt to request employee data'}});
      }
    })
  }
  registerEmployee(employee: Employee) {
    this.http.post(`${this.backendUrl}/employees/register`, {...employee}, {headers: this.authService.getTokenHeader()}).subscribe({
      next: () => {
        this.getAllEmployees();
      },
      error: (err) => {
        console.log(err)
        let errorText = '';
        if (err['status'] === 409) errorText = 'Account was deleted';
        this.dialog.open(ErrorDialogComponent, {data: {message: errorText, isSuccessful: false}})
      }
    })
  }
  deleteEmployee(employeeId: string) {
    this.http.delete(`${this.backendUrl}/employees/${employeeId}`, {headers: this.authService.getTokenHeader()}).subscribe({
      next: () => {
        this.getAllEmployees();
      },
      error: (err) => {
        let errorText = '';
        if (err['status'] === 409) errorText = 'Employee has uncompleted orders';
        this.dialog.open(ErrorDialogComponent, {data: {message: errorText, isSuccessful: false}})
      }
    })
  }

}
