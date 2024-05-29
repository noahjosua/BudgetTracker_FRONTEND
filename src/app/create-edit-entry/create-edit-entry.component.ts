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
    let isEntryValid = this.entryValidator();

    if(isEntryValid) {
      this.entry.datePlanned = this.entry.datePlanned;
      this.entry.category = this.entry.category.name;
      this.entry.amount = this.entry.amount;
      this.entry.description = this.entry.description;
      this.entry.type = '';

      this.entry.reset({
        datePlanned: '',
        category: '',
        description: '',
        amount: 0.0,
        type: ''
      });
      
      this.visible = false;
    }

  }

  onCancel() {
    this.visible = false;
  }

 entryValidator(): boolean {
    if (this.isTypeChosen && this.isDesValid && this.isCategoryChosen && this.isAmountValid && this.isDateValid) {
      return true;
    }
    return false;
  }

  typeChosen() : boolean {
    this.isTypeChosen = true;
    return this.isTypeChosen;
  }

  validateDes(): boolean {
    if (this.entry.category.length > 0 && this.entry.category.length < 50) {
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
    const regex = /^((0[1-9]|[12][0-9]|3[01])[\.\/](0[13578]|1[02])[\.\/](19|20)\d{2}|(0[1-9]|[12][0-9]|30)[\.\/](0[469]|11)[\.\/](19|20)\d{2}|(0[1-9]|1[0-9]|2[0-8])[\.\/]02[\.\/](19|20)\d{2}|29[\.\/]02[\.\/]((19|20)(04|08|[2468][048]|[13579][26])|2000))$/;
    if (regex.test(this.entry.datePlanned)){
      this.isDateValid = true;
    }
    return this.isDateValid;
  }
}
