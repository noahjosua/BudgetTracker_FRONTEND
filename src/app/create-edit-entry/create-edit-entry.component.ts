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
    /*
          if(!this.entry.datePlanned){
            this.isDateValid = false;
          }

          this.entry.datePlanned = this.entry.datePlanned.replace(/[-/]/g, '.'); // Trennzeichen normalisieren
          this.entry.datePlanned = this.entry.datePlanned.replace(/[^0-9.: ]/g, ''); // ungültige Zeichen entfernen
          this.entry.datePlanned = this.entry.datePlanned.replace(/ +/g, ' '); // doppelte Leerzeichen entfernen

          var splitParts = this.entry.datePlanned.split('.');
          var day = splitParts[0];
          var month = splitParts[1];
          var year = splitParts[2];

          var check = new Date(year, month - 1, day);

          var day2 = check.getDate();
          var year2 = check.getFullYear();
          var month2 = check.getMonth() + 1;

          if(year2 == year && month == month2 && day == day2 ){
            this.isDateValid = true;
          }

          return this.isDateValid;
        }
        /*
            let dateArray = this.entry.datePlanned.split("/");

            if (dateArray.length !== 3) {
              this.isDateValid = false;
              return this.isDateValid;
            }

            let day = parseInt(dateArray[0], 10);
            let month = parseInt(dateArray[1], 10) - 1;
            let year = parseInt(dateArray[2], 10);

            if (isNaN(day) || isNaN(month) || isNaN(year)) {
              this.isDateValid = false;
              return this.isDateValid;
            }

            let dateObj = new Date(year, month, day);

            if (dateObj.getFullYear() === year && dateObj.getMonth() === month && dateObj.getDate() === day) {
              console.log("Gültiges Datum");
              this.isDateValid = true;
            } else {
              console.log("Ungültiges Datum: Datum existiert nicht");
              this.isDateValid = false;
            }

            return this.isDateValid;
          } */
    this.isDateValid = true;
    return this.isDateValid;
  }
}
