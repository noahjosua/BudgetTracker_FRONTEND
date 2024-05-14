import {Component} from '@angular/core';
import {IncomeService} from "../services/income.service";
import {ExpenseService} from "../services/expense.service";

@Component({
  selector: 'app-create-edit-entry',
  templateUrl: './create-edit-entry.component.html',
  styleUrl: './create-edit-entry.component.css'
})
export class CreateEditEntryComponent {

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

  constructor(public incomeService: IncomeService, public expenseService: ExpenseService) {
  }

  onOpenDialog() {
    if (this.visible) {
      this.visible = false;
    } else {
      this.visible = true;
    }
  }

  onSave() {
    this.entry.datePlanned = '11.05.2024';
    this.entry.category = this.entry.category.name;
    if(this.type == 'Einnahme') {
      this.incomeService.addIncome(this.entry);
    }
    if(this.type == 'Ausgabe') {
      this.expenseService.addExpense(this.entry);
    }

    // clear entry and validation
  }

  onCancel() {
    this.visible = false;
  }
}
