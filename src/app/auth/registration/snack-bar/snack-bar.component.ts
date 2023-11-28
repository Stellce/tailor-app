import {Component, Inject, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarLabel,
  MatSnackBarActions
} from "@angular/material/snack-bar";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSnackBarAction, MatSnackBarLabel, MatSnackBarActions],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.scss'
})
export class SnackBarComponent {
  snackBarRef = inject(MatSnackBarRef);
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {
  }
}
