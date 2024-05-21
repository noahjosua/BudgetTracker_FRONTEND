import {Component} from '@angular/core';

@Component({
  selector: 'app-revenue-list',
  templateUrl: './revenue-list.component.html',
  styleUrl: './revenue-list.component.css'
})
export class RevenueListComponent {

  incomes_and_expenses: any[] = [];

  constructor() {
  }

  onDelete(entry: any) {
  }
}
