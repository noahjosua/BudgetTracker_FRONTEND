import {Component} from '@angular/core';
import {mock_income_and_expenses} from "../mock-data-income-and-expenses";


@Component({
  selector: 'app-revenue-list',
  templateUrl: './revenue-list.component.html',
  styleUrl: './revenue-list.component.css'
})
export class RevenueListComponent {

  incomes_and_expenses: any[] = mock_income_and_expenses;

  constructor() {
  }

  onDelete(entry: any) {
  }

  formattedDate(date: Date) {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  }
}
