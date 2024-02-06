import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrl: './yes-no-dialog.component.scss'
})
export class YesNoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<YesNoDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: {message: string}
  ) {}
  onYes() {
    this.dialogRef.close({event:'Yes'})
  }
  onNo() {
    this.dialogRef.close({event:'No'})
  }
}
