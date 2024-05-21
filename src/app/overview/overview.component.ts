import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {
  total_income: number = 0;
  total_expense: number = 2.50;
  saldo: number = 5.00;

  constructor() {
  }
}
