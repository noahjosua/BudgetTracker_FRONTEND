import {Component} from '@angular/core';
import {ValidatorEntryDirective} from "./validator-entry.directive";


@Component({
  selector: 'app-create-edit-entry',
  templateUrl: './create-edit-entry.component.html',
  styleUrl: './create-edit-entry.component.css'
})
export class CreateEditEntryComponent {
  validatorDirective: ValidatorEntryDirective = new ValidatorEntryDirective();

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

    if (this.validatorDirective.validate(this.entry) == null) {
      this.entry.datePlanned = '11.05.2024';
      this.entry.category = this.entry.category.name;
      this.entry.amount = this.entry.amount;
      this.entry.description = 'IDk m8';

      this.entry.reset({
        datePlanned: '',
        category: '',
        description: '',
        amount: 0.0,
        type: ''
      });

      this.visible = false;

    } else {
      console.log(this.validatorDirective.validate(this.entry));
    }

  }

  onCancel() {
    this.visible = false;
  }


}
