import {Observable, Subject} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Income} from "../model/income.model";
import {Injectable} from "@angular/core";
import { map } from 'rxjs/operators';
import {Expense} from "../model/expense.model";

@Injectable({providedIn: 'root'})
export class ExpenseService {
  private expenses: Expense[] = [];
  private expensesUpdated = new Subject<Expense[]>(); // Subject to notify subscribers about expense updates

  constructor(private httpClient: HttpClient) {
  }

  getExpensesUpdatedListener(): Observable<Expense[]> {
    return this.expensesUpdated.asObservable();
  }

  fetchExpenses() {
    this.httpClient.get('http://localhost:8080/expenses', {
      observe: 'response',
      responseType: 'json'
    }).pipe(map((res: HttpResponse<any>) => res.body))
      .subscribe(
      (expenses: Expense[]) => {
        this.expenses = expenses;
        this.expensesUpdated.next([...this.expenses]);
        console.log(this.expenses);
      });
  }

  addExpense(expense: Expense) {
    console.log(JSON.stringify(expense));
    this.httpClient.post('http://localhost:8080/saveExpense', JSON.stringify(expense), {
      observe: 'response',
      responseType: 'text'
    }).subscribe((res) => {
      console.log(res.body);
      this.expenses.push(expense);
      this.expensesUpdated.next([...this.expenses]);
    });
  }

  deleteExpense(id: number) {
    this.httpClient.delete('http://localhost:8080/deleteExpense/' + id, {
      observe: 'response',
      responseType: 'text'
    }).subscribe((res) => {
      console.log(res.body);
      // TODO anzeige aktualisieren
    });
  }
}
