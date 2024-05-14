import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {IncomeService} from "../services/income.service";
import {Income} from "../model/income.model";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  private incomeSubscription: Subscription | undefined;

  total_income: number = 0;
  total_expense: number = 2.50;
  saldo: number = 5.00;

  constructor(public incomeService: IncomeService) {
  }

  ngOnInit() {
    this.incomeSubscription = this.incomeService.getIncomesUpdatedListener().subscribe((incomes: Income[]) => {
      this.total_income = 0;
      incomes.forEach(income => this.total_income += income.amount);
    });
  }
}
