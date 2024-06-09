import {Component} from '@angular/core';

@Component({
  selector: 'app-create-edit-entry',
  templateUrl: './create-edit-entry.component.html',
  styleUrl: './create-edit-entry.component.css'
})
export class CreateEditEntryComponent {

  isTypeChosen: boolean = false;
  isDesValid: boolean = false;
  isCategoryChosen: boolean = false;
  isAmountValid: boolean = false;
  isDateValid: boolean = false;


  visible: boolean = false;
  categories: any = [
    {name: 'A'}, {name: 'B'}, {name: 'C'}
  ];
  types: any = [
    {name: 'Einnahme'}, {name: 'Ausgabe'} // abhängig davon an unterschiedliche Endpunkte
  ];

  entry: any = {
    datePlanned: '',
    category: '',
    description: '',
    amount: 0.0
  };
  type: string = '';

  constructor() {
  }


  onOpenDialog() {
    if (this.visible) {
      this.visible = false;
    } else {
      this.visible = true;
    }
  }

  onSave() {

    if (this.entryValidator()) {

      this.entry.datePlanned = this.entry.datePlanned;
      this.entry.category = this.entry.category.name;
      this.entry.amount = this.entry.amount;
      this.entry.description = this.entry.description;
      this.entry.type = '';

      this.isDateValid = false;
      this.isCategoryChosen = false;
      this.isAmountValid = false;
      this.isDesValid = false;
      this.isTypeChosen = false;

      this.visible = false;

      this.entry.reset({
        datePlanned: '',
        category: '',
        description: '',
        amount: 0.0,
        type: ''
      });
    }
  }


  onCancel() {
    this.visible = false;
  }

  entryValidator(): boolean {
    if (this.isTypeChosen && this.isAmountValid && this.isDateValid && this.isDesValid && this.isCategoryChosen) {
      return true;
    }
    return false;
  }

  typeChosen(): boolean {
    this.isTypeChosen = true;
    return this.isTypeChosen;
  }

  validateDes(): boolean {

    if (this.entry.description.length > 0 && this.entry.description.length < 50) {
      this.isDesValid = true;
    }
    return this.isDesValid;
  }

  categoryChosen(): boolean {
    this.isCategoryChosen = true;
    return this.isCategoryChosen;
  }

  validateAmount(): boolean {
    if (this.entry.amount > 0) {
      this.isAmountValid = true;
    }
    return this.isAmountValid;
  }

  validateDate(): boolean {
    this.isDateValid = true;
    return this.isDateValid;
  }
}
