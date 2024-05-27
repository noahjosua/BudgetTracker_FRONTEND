import {Directive} from '@angular/core';
import {NG_VALIDATORS, Validator, AbstractControl, ValidationErrors} from '@angular/forms';
import {Expense} from "../model/expense.model";
import {Income} from "../model/income.model";

@Directive({
  selector: '[ValidatorEntryDirective]',
  providers: [{provide: NG_VALIDATORS, useExisting: ValidatorEntryDirective, multi: true}]
})

export class ValidatorEntryDirective implements Validator {

  validate(entryControl: AbstractControl): ValidationErrors | null {
    const entry: any = entryControl.value;
    if (!entryControl.value || entryControl.value.trim() === '') { // Überprüfen, ob das Feld leer ist
      return {'required': true}; // Fehler zurückgeben, wenn das Feld leer ist
    }

    const dateFormatRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    switch (entry) {
      case !dateFormatRegex.test(entry.datePlanned):
        return {'Invalid date.': true}
      case entry.amount < 0:
        return {'No negative amounts permitted.': true}
      case entry.description.length < 1:
        return {'Description needed.': true}
      case entry.category.isEmpty():
        return {'Category cannot be empty.': true}
      default:
        return null;
    }
  }}







