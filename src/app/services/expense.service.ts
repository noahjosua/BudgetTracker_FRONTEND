
import {Injectable} from "@angular/core";
import {Entry} from "../model/entry.model";
import {map, Observable, Subject} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Constants} from "../constants";
import {NotificationMessageModel} from "../model/notification-message.model";
import {DateConverterService} from "./date-converter.service";

/**
 * Manages categories, expenses, and notification messages related to expenses.
 * Uses HttpClient for API interactions and DateConverterService for date handling.
 * Provides methods to fetch categories and expenses, add, update, and delete expenses.
 */
@Injectable({providedIn: 'root'})

export class ExpenseService {

  private categories: string[] = [];
  private categoriesUpdated: Subject<string[]> = new Subject<string[]>();

  private expenses: Entry[] = [];
  private expensesUpdated: Subject<Entry[]> = new Subject<Entry[]>();

  private showMessageToUserSubject = new Subject<NotificationMessageModel>();

  constructor(private httpClient: HttpClient, private dateConverterService: DateConverterService) {
  }

  /**
   * Returns an observable for categories updates.
   * @returns Observable<string[]> - Observable emitting updated categories.
   */
  getCategoriesUpdatedListener(): Observable<string[]> {
    return this.categoriesUpdated.asObservable();
  }

  /**
   * Returns an observable for expenses updates.
   * @returns Observable<Entry[]> - Observable emitting updated expenses.
   */
  getExpensesUpdatedListener(): Observable<Entry[]> {
    return this.expensesUpdated.asObservable();
  }

  /**
   * Returns an observable for notification messages related to expenses.
   * @returns Observable<NotificationMessageModel> - Observable emitting notification messages.
   */
  getShowMessageToUserSubject() {
    return this.showMessageToUserSubject.asObservable();
  }

  /**
   * Fetches expense categories from the server and updates the categories list.
   */
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

  /**
   * Fetches expenses for a specific date from the server and updates the expenses list.
   * @param date - The date for which expenses are fetched.
   */
  fetchExpensesByDate(date: Date) {
    const isoDateString = this.dateConverterService.convertToDateString(date);
    const url = `${environment.baseUrl}${environment.path_expense}${environment.endpoint_get_by_date}/${isoDateString}`;
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

  /**
   * Adds a new expense to the server and updates the expenses list upon success.
   * Notifies subscribers with a success message upon successful addition, or an error message on failure.
   * @param expense - The expense object to be added.
   * @param date - The date associated with the expense.
   */
  addExpense(expense: Entry, date: Date) {
    expense = this.dateConverterService.setTime(expense);
    const URL = `${environment.baseUrl}${environment.path_expense}${environment.endpoint_save}`
    this.httpClient.post(URL, JSON.stringify(expense), {
      headers: { 'Content-Type': 'application/json' },
      observe: 'response'
    })
      .pipe(map(response => response.body))
      .subscribe({
        next: (body) => {
          if (body && typeof body === 'object' && Constants.RESPONSE_MESSAGE_KEY in body && Constants.RESPONSE_ENTRY_KEY in body) {
            try {
              const newExpense: Entry = JSON.parse(JSON.stringify(body.entry));
              const planned = new Date(newExpense.datePlanned);
              if (planned.getMonth() === date.getMonth()) {
                this.expenses.push(newExpense);
              }
              this.expensesUpdated.next([...this.expenses]);
              this.showMessageToUserSubject.next({
                severity: 'success',
                summary: 'Erfolg',
                detail: 'Ausgabe gespeichert.'
              });
            } catch (error) {
              this.showMessageToUserSubject.next({
                severity: 'error',
                summary: 'Fehler',
                detail: 'Ausgabe konnte nicht gespeichert werden.'
              });
            }
          }
        },
        error: () => {
          this.showMessageToUserSubject.next({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Ausgabe konnte nicht gespeichert werden.'
          });
        }
      });
  }


  /**
 * Updates an existing expense entry by sending an HTTP PUT request.
 *
 * If the update is successful and the response contains the expected keys, the updated entry is parsed.
 * The entry is then compared against the provided date to determine if it should be included in the current
 * month's expenses. The updated list of expenses is emitted and a success message is shown.
 *
 * In case of errors, an error message is shown to the user.
 *
 * @param expense - The expense entry to be updated.
 * @param date - The date to compare against the planned date of the updated expense.
 */
updateExpense(expense: Entry, date: Date) {
  const URL = `${environment.baseUrl}${environment.path_expense}${environment.endpoint_update}`
  this.httpClient.put(URL, JSON.stringify(expense), {
    headers: {'Content-Type': 'application/json'},
    observe: 'response'
  })
    .pipe(map(response => response.body))
    .subscribe({
      next: (body) => {
        if (body && typeof body === 'object' && Constants.RESPONSE_MESSAGE_KEY in body && Constants.RESPONSE_ENTRY_KEY in body) {
          try {
            const updatedExpense: Entry = JSON.parse(JSON.stringify(body.entry));
            const planned = new Date(updatedExpense.datePlanned);
            this.expenses = this.expenses.filter(entry => entry.id !== updatedExpense.id);
            if (planned.getMonth() === date.getMonth()) {
              this.expenses.push(updatedExpense);
            }
            this.expensesUpdated.next([...this.expenses]);
            this.showMessageToUserSubject.next({
              severity: 'success',
              summary: 'Erfolg',
              detail: 'Ausgabe geändert.'
            });
          } catch (error) {
            this.showMessageToUserSubject.next({
              severity: 'error',
              summary: 'Fehler',
              detail: 'Ausgabe konnte nicht geändert werden.'
            });
          }
        }
      },
      error: () => {
        this.showMessageToUserSubject.next({
          severity: 'error',
          summary: 'Fehler',
          detail: 'Ausgabe konnte nicht geändert werden.'
        });
      }
    });
}

  /**
   * Deletes an expense from the server and updates the expenses list upon success.
   * Notifies subscribers with a success message upon successful deletion, or an error message on failure.
   * @param expense - The expense object to be deleted.
   */
  deleteExpense(expense: Entry) {
    const expenseId = expense.id
    const URL = `${environment.baseUrl}${environment.path_expense}${environment.endpoint_delete}/${expenseId}`;
    this.httpClient.delete(URL, {observe: 'response', responseType: 'text'})
      .subscribe({
        next: (_) => {
          this.expenses = this.expenses.filter(i => i.id !== expenseId);
          this.expensesUpdated.next([...this.expenses]);
          this.showMessageToUserSubject.next({
            severity: 'success',
            summary: 'Erfolg',
            detail: 'Ausgabe gelöscht.'
          });
        },
        error: () => {
          this.showMessageToUserSubject.next({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Ausgabe konnte nicht gelöscht werden.'
          });
        }
      });
  }
}

