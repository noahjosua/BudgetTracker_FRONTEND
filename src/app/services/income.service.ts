import {Observable, Subject} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {map} from 'rxjs/operators';
import {environment} from "../../environments/environment";
import {Entry} from "../model/entry.model";
import {Constants} from "../constants";
import {NotificationMessageModel} from "../model/notification-message.model";
import {DateConverterService} from "./date-converter.service";

/**
 * Manages categories, incomes, and notification messages related to incomes.
 * Uses HttpClient for API interactions and DateConverterService for date handling.
 * Provides methods to fetch categories and incomes, add, update, and delete incomes.
 */
@Injectable({providedIn: 'root'})
export class IncomeService {
  private categories: string[] = [];
  private categoriesUpdated = new Subject<string[]>();

  private incomes: Entry[] = [];
  private incomesUpdated = new Subject<Entry[]>();

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
   * Returns an observable for incomes updates.
   * @returns Observable<Entry[]> - Observable emitting updated incomes.
   */
  getIncomesUpdatedListener(): Observable<Entry[]> {
    return this.incomesUpdated.asObservable();
  }

  /**
   * Returns an observable for notification messages related to incomes.
   * @returns Observable<NotificationMessageModel> - Observable emitting notification messages.
   */
  getShowMessageToUserSubject() {
    return this.showMessageToUserSubject.asObservable();
  }

  /**
   * Fetches expense categories from the server and updates the categories list.
   */
  fetchCategories() {
    const url = `${environment.baseUrl}${environment.path_income}${environment.endpoint_get_categories}`;
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
   * Fetches incomes for a specific date from the server and updates the incomes list.
   * @param date - The date for which incomes are fetched.
   */
  fetchIncomesByDate(date: Date) {
    const isoDateString = this.dateConverterService.convertToDateString(date);
    const url = `${environment.baseUrl}${environment.path_income}${environment.endpoint_get_by_date}/${isoDateString}`;
    this.httpClient.get(url, {
      observe: 'response',
      responseType: 'json'
    })
      .pipe(map(response => response.body))
      .subscribe((body) => {
        if (body && typeof body === 'object' && Constants.RESPONSE_MESSAGE_KEY in body && Constants.RESPONSE_ENTRY_KEY in body) {
          try {
            this.incomes = [];
            const newIncomes: Entry[] = JSON.parse(JSON.stringify(body.entry));
            newIncomes.forEach(income => this.incomes.push(income));
            this.incomesUpdated.next([...this.incomes]);
          } catch (error) {
            console.error('Error parsing json expense object:', error);
          }
        } else {
          console.error('The response body does not contain an entry property.');
        }
      });
  }

  /**
   * Adds a new income to the server and updates the incomes list upon success.
   * Notifies subscribers with a success message upon successful addition, or an error message on failure.
   * @param income - The income object to be added.
   * @param date - The date associated with the income.
   */
  addIncome(income: Entry, date: Date) {
    income = this.dateConverterService.setTime(income);
    const URL = `${environment.baseUrl}${environment.path_income}${environment.endpoint_save}`
    this.httpClient.post(URL, JSON.stringify(income), {
      headers: {'Content-Type': 'application/json'},
      observe: 'response'
    })
      .pipe(map(response => response.body))
      .subscribe({
        next: (body) => {
          if (body && typeof body === 'object' && Constants.RESPONSE_MESSAGE_KEY in body && Constants.RESPONSE_ENTRY_KEY in body) {
            try {
              const newIncome: Entry = JSON.parse(JSON.stringify(body.entry));
              const planned = new Date(newIncome.datePlanned);
              if (planned.getMonth() === date.getMonth()) {
                this.incomes.push(newIncome);
              }
              this.incomesUpdated.next([...this.incomes]);
              this.showMessageToUserSubject.next({
                severity: 'success',
                summary: 'Erfolg',
                detail: 'Einnahme gespeichert.'
              });
            } catch (error) {
              this.showMessageToUserSubject.next({
                severity: 'error',
                summary: 'Fehler',
                detail: 'Einnahme konnte nicht gespeichert werden.'
              });
            }
          }
        },
        error: () => {
          this.showMessageToUserSubject.next({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Einnahme konnte nicht gespeichert werden.'
          });
        }
      });
  }

  // TODO
  updateIncome(income: Entry) {

  }

  /**
   * Deletes an income from the server and updates the incomes list upon success.
   * Notifies subscribers with a success message upon successful deletion, or an error message on failure.
   * @param income - The income object to be deleted.
   */
  deleteIncome(income: Entry) {
    const incomeId = income.id;
    const URL = `${environment.baseUrl}${environment.path_income}${environment.endpoint_delete}/${incomeId}`;
    this.httpClient.delete(URL, {observe: 'response', responseType: 'text'})
      .subscribe({
        next: (_) => {
          this.incomes = this.incomes.filter(i => i.id !== incomeId);
          this.incomesUpdated.next([...this.incomes]);
          this.showMessageToUserSubject.next({
            severity: 'success',
            summary: 'Erfolg',
            detail: 'Einnahme gelöscht.'
          });
        },
        error: () => {
          this.showMessageToUserSubject.next({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Einnahme konnte nicht gelöscht werden.'
          });
        }
      });
  }
}
