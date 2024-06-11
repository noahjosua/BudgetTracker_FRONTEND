import {Injectable} from "@angular/core";
import {Entry} from "../model/entry.model";
import {map, Observable, Subject} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Constants} from "../constants";

// TODO refactor: doppeltes zusammenfassen
@Injectable({providedIn: 'root'})
export class ExpenseService {
  private categories: string[] = [];
  private categoriesUpdated: Subject<string[]> = new Subject<string[]>();

  private expenses: Entry[] = [];
  private expensesUpdated: Subject<Entry[]> = new Subject<Entry[]>();

  private expense: Entry | undefined = undefined;
  private expenseUpdated: Subject<Entry> = new Subject<Entry>();


  constructor(private httpClient: HttpClient) {
  }

  getCategoriesUpdatedListener(): Observable<string[]> {
    return this.categoriesUpdated.asObservable();
  }

  getExpensesUpdatedListener(): Observable<Entry[]> {
    return this.expensesUpdated.asObservable();
  }

  getExpenseUpdatedListener(): Observable<Entry> {
    return this.expenseUpdated.asObservable();
  }

  fetchCategories() {
    const url = `${environment.baseUrl}${environment.path_expense}${environment.endpoint_get_categories}`;
    this.httpClient.get(url, {
      observe: 'response',
      responseType: 'text'
    }).pipe(map((res: HttpResponse<any>) => JSON.parse(res.body)))
      .subscribe((categories: string[]) => {
        this.categories = categories;
        this.categoriesUpdated.next([...this.categories]);
      });
  }

  fetchExpensesByDate(date: Date) {
    const url = `${environment.baseUrl}${environment.path_expense}${environment.endpoint_get_by_date}/${date}`;
    this.httpClient.get(url, {
      observe: 'response',
      responseType: 'json'
    })
      .pipe(map(response => response.body))
      .subscribe((body) => {
        if (body && typeof body === 'object' && Constants.RESPONSE_MESSAGE_KEY in body && Constants.RESPONSE_ENTRY_KEY in body) {
          try {
            this.expenses = [];
            const newExpenses: Entry[] = JSON.parse(JSON.stringify(body.entry));
            newExpenses.forEach(expense => this.expenses.push(expense));
            this.expensesUpdated.next([...this.expenses]);
          } catch (error) {
            console.error('Error parsing json expense object:', error);
          }
        } else {
          console.error('The response body does not contain an entry property.');
        }
      });
  }

  /*
  fetchExpenseById(id: number) {
    const url = `${environment.baseUrl}${environment.path_expense}${environment.endpoint_get_by_id}${id}`;
    this.httpClient.get(url, {
      observe: 'response',
      responseType: 'json'
    }).pipe(map(response => response.body))
      .subscribe((body) => {
        if (body && typeof body === 'object' && Constants.RESPONSE_MESSAGE_KEY in body && Constants.RESPONSE_ENTRY_KEY in body) {
          try {
            this.expense = JSON.parse(JSON.stringify(body.entry));
            if (this.expense !== null && this.expense !== undefined) {
              this.expenseUpdated.next(this.expense);
            }
          } catch (error) {
            console.error('Error parsing json expense object:', error);
          }
        } else {
          console.error('The response body does not contain an entry property.');
        }
      });
  }
   */

  addExpense(expense: Entry, date: Date) {
    const URL = `${environment.baseUrl}${environment.path_expense}${environment.endpoint_save}`
    this.httpClient.post(URL, JSON.stringify(expense), {
      headers: {'Content-Type': 'application/json'},
      observe: 'response'
    })
      .pipe(map(response => response.body))
      .subscribe((body) => {
        if (body && typeof body === 'object' && Constants.RESPONSE_MESSAGE_KEY in body && Constants.RESPONSE_ENTRY_KEY in body) {
          try {
            const newExpense: Entry = JSON.parse(JSON.stringify(body.entry));
            const planned = new Date(newExpense.datePlanned);
            if(planned.getMonth() === date.getMonth()) {
              this.expenses.push(newExpense);
            }
            this.expensesUpdated.next([...this.expenses]);
          } catch (error) {
            console.error('Error parsing json expense object:', error);
          }
        } else {
          console.error('The response body does not contain an entry property.');
        }
      });
  }

  // TODO
  updateExpense(expense: Entry) {

  }

  // TODO Fehler fangen -- wie in saveExpense
  deleteExpense(expense: Entry) {
    const expenseId = expense.id;
    const URL = `${environment.baseUrl}${environment.path_expense}${environment.endpoint_delete}/${expenseId}`;
    this.httpClient.delete(URL, {observe: 'response', responseType: 'text'})
      .subscribe((result) => {
        console.log(result);
        this.expenses = this.expenses.filter(e => e.id !== expenseId);
        this.expensesUpdated.next([...this.expenses]);
      });
  }
}

