import { Directive } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

/** A hero's name can't match the hero's alter ego */
export const addresseValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const label1 = control.get('label1');
  const rue = control.get('rue');
  const nomRue = control.get('nomRue');
  return !label1.value && !rue.value && !nomRue.value ? { 'isValid': true } : null;
};

@Directive({
  selector: '[appValidAddress]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ValidAddressDirective, multi: true }]
})
export class ValidAddressDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors {
    return addresseValidator(control)
  }
}