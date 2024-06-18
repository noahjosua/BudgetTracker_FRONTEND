import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {

  @Input() incomes: any;
  @Input() expenses: any;

  @Input() total_income: any;
  @Input() total_expense: any;
  @Input() total: any;


  @Output() showIncomes: EventEmitter<boolean> = new EventEmitter();
  @Output() showExpenses: EventEmitter<boolean> = new EventEmitter();
  @Output() showEntries: EventEmitter<boolean> = new EventEmitter();

  showOnlyIncomes() {
    this.showIncomes.emit(true);
  }
  showOnlyExpenses() {
    this.showExpenses.emit(true);
  }

  showAllEntries() {
    this.showEntries.emit(true);
  }

}
