import {Injectable} from "@angular/core";
import {Expense} from "../model/expense.model";
import {map, Observable, Subject} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class ExpenseService {
  private expenses: Expense[] = [];
  private expensesUpdated = new Subject<Expense[]>(); // Subject to notify subscribers about expense updates
  private categories: string[] = [];
  private categoriesUpdated = new Subject<string[]>(); // Subject to notify subscribers about expense updates

  constructor(private httpClient: HttpClient) {
  }

  getExpensesUpdatedListener(): Observable<Expense[]> {
    return this.expensesUpdated.asObservable();
  }


  getCategoriesUpdatedListener(): Observable<string[]> {
    return this.categoriesUpdated.asObservable();
  }

  fetchCategories() {
    const url = `${environment.baseUrl}${environment.endpoint_expenses_categories}`;
    this.httpClient.get(url, {
      observe: 'response',
      responseType: 'text'
    }).pipe(map((res: HttpResponse<any>) => {
        return JSON.parse(res.body);
      })
    ).subscribe((categories: string[]) => {
      this.categories = categories;
      this.categoriesUpdated.next([...this.categories]);
    });
  }

  fetchExpenses() {
    const url = `${environment.baseUrl}${environment.endpoint_expenses}`;
    this.httpClient.get(url, {
      observe: 'response',
      responseType: 'json'
    }).pipe(map((res: HttpResponse<any>) => res.body))
      .subscribe(
        (expenses: Expense[]) => {
          this.expenses = expenses;
          this.expensesUpdated.next([...this.expenses]);
        });
  }

  fetchExpenseById(id: number) {
    const url = `${environment.baseUrl}${environment.endpoint_expense_by_id}${id}`;
    this.httpClient.get(url, {
      observe: 'response',
      responseType: 'json'
    }).pipe(map((res: HttpResponse<any>) => res.body))
      .subscribe(
        (expense: Expense[]) => {
          console.log(expense);
          // this.incomes = incomes;
          // this.incomesUpdated.next([...this.incomes]);
        });
  }
  
      addExpense(expense: Expense) {

        const URL = `${environment.baseUrl}${environment.endpoint_saveExpense}`
        this.httpClient.post(URL, JSON.stringify(expense), { observe: 'response', responseType: 'text' })
            .subscribe((result) => {
                console.log(result);
                this.expenses.push(expense);
                this.expensesUpdated.next([...this.expenses]);

            });

    }

    deleteExpense(expense: Expense) {
        const expenseId = expense.id;
        const URL = `${environment.baseUrl}${environment.endpoint_deleteExpense}/${expenseId}`;
        this.httpClient.delete(URL, { observe: 'response', responseType: 'text' })
            .subscribe((result) => {
                console.log(result);
                this.expenses = this.expenses.filter(e => e.id !== expenseId);
                this.expensesUpdated.next([...this.expenses]);
            });
    }
}

