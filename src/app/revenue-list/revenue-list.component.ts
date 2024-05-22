import {Component} from '@angular/core';
import {RevenueTypes} from "../model/revenue-types";

@Component({
  selector: 'app-revenue-list',
  templateUrl: './revenue-list.component.html',
  styleUrl: './revenue-list.component.css'
})
export class RevenueListComponent {

  incomes_and_expenses: any[] = [
    {
      id: 1,
      datePlanned: "22.05.2024",
      category: "Free time",
      description: "Bubble-tea",
      amount: 5.0,
      type: RevenueTypes.EXPENSE
    },
    {
      id: 2,
      datePlanned: "01.06.2024",
      category: "Rent",
      description: "",
      amount: 300.0,
      type: RevenueTypes.EXPENSE
    },
    {
      id: 3,
      datePlanned: "02.06.2024",
      category: "Salary",
      description: "Salary for the Month of May",
      amount: 538.0,
      type: RevenueTypes.INCOME
    },
    {
      id: 1,
      datePlanned: "05.06.2024",
      category: "Subscriptions",
      description: "Netflix",
      amount: 6.99,
      type: RevenueTypes.EXPENSE
    },
    {
      id: 1,
      datePlanned: "18.05.2024",
      category: "Pocket Money",
      description: "",
      amount: 200.0,
      type: RevenueTypes.INCOME
    }
  ];

  constructor() {
  }

  onDelete(entry: any) {
  }
}
