
import {Observable, Subject} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {map} from 'rxjs/operators';
import {environment} from "../../environments/environment";
import {Entry} from "../model/entry.model";
import {Constants} from "../constants";
import {NotificationMessage} from "../model/NotificationMessage";

@Injectable({providedIn: 'root'})

export class IncomeService {
  private categories: string[] = [];
  private categoriesUpdated = new Subject<string[]>();

  private incomes: Entry[] = [];
  private incomesUpdated = new Subject<Entry[]>();

  private showMessageToUserSubject = new Subject<NotificationMessage>();
  private notificationErrorAddIncome: NotificationMessage = {
    severity: 'error',
    summary: 'Fehler',
    detail: 'Einnahme konnte nicht gespeichert werden.'
  };

  constructor(private httpClient: HttpClient) {
  }

  getCategoriesUpdatedListener(): Observable<string[]> {
    return this.categoriesUpdated.asObservable();
  }

  getIncomesUpdatedListener(): Observable<Entry[]> {
    return this.incomesUpdated.asObservable();
  }

  getShowMessageToUserSubject() {
    return this.showMessageToUserSubject.asObservable();
  }

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

  fetchIncomesByDate(date: Date) {
    const isoDateString = date.toISOString().split('T')[0];
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

  addIncome(income: Entry, date: Date) {
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
              this.showMessageToUserSubject.next(this.notificationErrorAddIncome);
            }
          }
        },
        error: () => {
          this.showMessageToUserSubject.next(this.notificationErrorAddIncome);
        }
      });
  }


  // TODO

  updateIncome(income: Entry) {

    const incomeId = income.id;
    const URL = `${environment.baseUrl}${environment.path_income}${environment.endpoint_update}/${incomeId}`
    this.httpClient.put(URL, JSON.stringify(income), {
      headers: { 'Content-Type': 'application/json' },
      observe: 'response'
    })
      .pipe(map(response => response.body))
      .subscribe((body) => {
        if (body && typeof body === 'object' && Constants.RESPONSE_MESSAGE_KEY in body && Constants.RESPONSE_ENTRY_KEY in body) {
          try {
            const indexId = this.incomes.findIndex(i => i.id === income.id);
            if (indexId !== -1) {

              const updatedIncome: Entry = JSON.parse(JSON.stringify(body.entry));
              this.incomes[indexId] = updatedIncome;
              this.incomesUpdated.next([...this.incomes]);
            }
            else {
              console.error('Error finding income with the specified ID.')
            }
          } catch (error) {
            console.error('Error parsing json income object:', error);
          }
        } else {
          console.error('The response body does not contain an entry property.');
        }
      });
  }

  // TODO Fehler fangen -- wie in saveExpense
  deleteIncome(income: Entry) {
    const incomeId = income.id;
    const URL = `${environment.baseUrl}${environment.path_income}${environment.endpoint_delete}/${incomeId}`;
    this.httpClient.delete(URL, {observe: 'response', responseType: 'text'})
      .subscribe({
        next: (body) => {
          console.log(body);
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
