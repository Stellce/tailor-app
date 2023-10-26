import {Directive, Input} from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NgModel,
  ValidationErrors,
  Validator
} from "@angular/forms";

@Directive({
  selector: '[appSamePasswords]',
  providers: [{provide: NG_VALIDATORS, useExisting: SamePasswordsDirective, multi: true}]
})
export class SamePasswordsDirective implements Validator{
  @Input('appSamePasswords') samePasswords: NgModel;

  validate(control: AbstractControl): ValidationErrors | null {
    if(control.value === this.samePasswords.control.value) return null;
    return {notSamePass: true}
  }

}
