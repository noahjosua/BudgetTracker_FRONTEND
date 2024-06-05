import { Observable, Subject } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { Entry } from "../model/entry.model";
import { RESPONSE_ENTRY_KEY, RESPONSE_MESSAGE_KEY } from "../constants";

@Injectable({ providedIn: 'root' })
export class IncomeService {
  private categories: string[] = [];
  private categoriesUpdated = new Subject<string[]>();

  private incomes: Entry[] = [];
  private incomesUpdated = new Subject<Entry[]>();

  private income: Entry | undefined = undefined;
  private incomeUpdated = new Subject<Entry>();


  constructor(private httpClient: HttpClient) {
  }

  getCategoriesUpdatedListener(): Observable<string[]> {
    return this.categoriesUpdated.asObservable();
  }

  getIncomesUpdatedListener(): Observable<Entry[]> {
    return this.incomesUpdated.asObservable();
  }

  getIncomeUpdatedListener(): Observable<Entry> {
    return this.incomeUpdated.asObservable();
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

  fetchIncomes() {
    const url = `${environment.baseUrl}${environment.path_income}${environment.endpoint_get_all}`;
    this.httpClient.get(url, {
      observe: 'response',
      responseType: 'json'
    })
      .pipe(map(response => response.body))
      .subscribe((body) => {
        if (body && typeof body === 'object' && RESPONSE_MESSAGE_KEY in body && RESPONSE_ENTRY_KEY in body) {
          try {
            const newIncomes: Entry[] = JSON.parse(JSON.stringify(body.entry));
            newIncomes.forEach((income) => this.incomes.push(income));
            this.incomesUpdated.next([...this.incomes]);
          } catch (error) {
            console.error('Error parsing json income object:', error);
          }
        } else {
          console.error('The response body does not contain an entry property.');
        }
      });
  }

  fetchIncomeById(id: number) {
    const url = `${environment.baseUrl}${environment.path_income}${environment.endpoint_get_by_id}${id}`;
    this.httpClient.get(url, {
      observe: 'response',
      responseType: 'json'
    }).pipe(map(response => response.body))
      .subscribe((body) => {
        if (body && typeof body === 'object' && RESPONSE_MESSAGE_KEY in body && RESPONSE_ENTRY_KEY in body) {
          try {
            this.income = JSON.parse(JSON.stringify(body.entry));
            if (this.income !== null && this.income !== undefined) {
              this.incomeUpdated.next(this.income);
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
  addIncome(income: Entry) {
    const URL = `${environment.baseUrl}${environment.path_income}${environment.endpoint_save}`
    this.httpClient.post(URL, JSON.stringify(income), { observe: 'response', responseType: 'text' })
      .subscribe((result) => {
        console.log(result);
        this.incomes.push(income);
        this.incomesUpdated.next([...this.incomes]);
      });
  }

  updateIncome(income: Entry) {

    const incomeId = income.id;
    const URL = `${environment.baseUrl}${environment.path_income}${environment.endpoint_update}/${incomeId}`
    this.httpClient.put(URL, JSON.stringify(income), {
      headers: { 'Content-Type': 'application/json' },
      observe: 'response'
    })
      .pipe(map(response => response.body))
      .subscribe((body) => {
        if (body && typeof body === 'object' && RESPONSE_MESSAGE_KEY in body && RESPONSE_ENTRY_KEY in body) {
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
    this.httpClient.delete(URL, { observe: 'response', responseType: 'text' })
      .subscribe((result) => {
        console.log(result);
        this.incomes = this.incomes.filter(i => i.id !== incomeId);
        this.incomesUpdated.next([...this.incomes]);
      });
  }
}
