import {Observable, Subject} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Income} from "../model/income.model";
import {Injectable} from "@angular/core";
import {map} from 'rxjs/operators';
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class IncomeService {
  private incomes: Income[] = [];
  private incomesUpdated = new Subject<Income[]>(); // Subject to notify subscribers about income updates
  private categories: string[] = [];
  private categoriesUpdated = new Subject<string[]>();

  constructor(private httpClient: HttpClient) {
  }

  getIncomesUpdatedListener(): Observable<Income[]> {
    return this.incomesUpdated.asObservable();
  }

  getCategoriesUpdatedListener(): Observable<string[]> {
    return this.categoriesUpdated.asObservable();
  }

  fetchCategories() {
    const url = `${environment.baseUrl}${environment.endpoint_incomes_categories}`;
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

  fetchIncomes() {
    const url = `${environment.baseUrl}${environment.endpoint_incomes}`;
    this.httpClient.get(url, {
      observe: 'response',
      responseType: 'json'
    }).pipe(map((res: HttpResponse<any>) => res.body))
      .subscribe(
        (incomes: Income[]) => {
          this.incomes = incomes;
          this.incomesUpdated.next([...this.incomes]);
        });
  }

  fetchIncomeById(id: number) {
    const url = `${environment.baseUrl}${environment.endpoint_income_by_id}${id}`;
    this.httpClient.get(url, {
      observe: 'response',
      responseType: 'json'
    }).pipe(map((res: HttpResponse<any>) => res.body))
      .subscribe(
        (income: Income[]) => {
          console.log(income);
          // this.incomes = incomes;
          // this.incomesUpdated.next([...this.incomes]);
        });
  }
}
