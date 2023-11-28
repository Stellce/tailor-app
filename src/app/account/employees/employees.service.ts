import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
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
  updateEmployeesComponentListener = new Subject<void>();

  constructor(private http: HttpClient, private authService: AuthService, private dialog: MatDialog) {}


  getUpdateEmployeesComponentListener() {
    return this.updateEmployeesComponentListener.asObservable();
  }
  getEmployees() {
    return this.employees;
  }
  getEmployeesListener() {
    return this.employeesListener.asObservable();
  }
  getAllEmployees() {
    this.http.get<Employee[]>(`${this.backendUrl}/employees`, {headers: this.getHeader()}).subscribe({
      next: (employees) => {
        this.employees = employees;
        this.employeesListener.next(employees);

      }
    })
  }
  registerEmployee(employee: Employee) {
    this.http.post(`${this.backendUrl}/employees/register`, {...employee}, {headers: this.getHeader()}).subscribe({
      next: () => {},
      error: (err) => {
        console.log(err)
        let errorText = '';
        if (err['status'] === 409) errorText = 'Акаунт вже iснує';
        this.dialog.open(ErrorDialogComponent, {data: {message: errorText, isSuccessful: false}})
      }
    })
  }
  deleteEmployee(employeeId: string) {
    this.http.delete(`${this.backendUrl}/employees/${employeeId}`, {headers: this.getHeader()}).subscribe({
      next: () => {},
      error: (err) => {
        let errorText = '';
        if (err['status'] === 409) errorText = 'Працiвник має незавершенi замовлення';
        this.dialog.open(ErrorDialogComponent, {data: {message: errorText, isSuccessful: false}})
      }
    })
  }

  updateEmployeesComponent() {
    this.updateEmployeesComponentListener.next();
  }

  private getHeader() {
    const authToken = this.authService.getToken();
    let headers = new HttpHeaders();
    return headers.set("Authorization", "Bearer " + authToken);
  }

}
