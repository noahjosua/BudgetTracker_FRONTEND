import { Component } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { IncomeService } from '../services/income.service';

@Component({
  selector: 'app-create-edit-entry',
  templateUrl: './create-edit-entry.component.html',
  styleUrl: './create-edit-entry.component.css'
})
export class CreateEditEntryComponent {

  visible: boolean = false;
  categories: any = [
    { name: 'A' }, { name: 'B' }, { name: 'C' }
  ];
  types: any = [
    { name: 'Einnahme' }, { name: 'Ausgabe' } // abhängig davon an unterschiedliche Endpunkte
  ];

  entry: any = {
    datePlanned: '',
    category: '',
    description: '',
    amount: 0.0
  };
  type: any = '';

  constructor(public expenseService: ExpenseService, public incomeService: IncomeService) {
  }

  onOpenDialog() {
    if (this.visible) {
      this.visible = false;
    } else {
      this.visible = true;
    }
  }

  onSave() {
    this.entry.dateCreated = new Date();
    this.entry.datePlanned = new Date();
    this.entry.category = "GROCERIES";

    if (this.type.name == 'Ausgabe') {
      this.expenseService.addExpense(this.entry);
    }

    if (this.type.name == 'Einnahme') {
      this.incomeService.addIncome(this.entry);
    }

    // clear entry and validation
  }

  onCancel() {
    this.visible = false;
  }
}
