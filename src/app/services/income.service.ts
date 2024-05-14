import {Observable, Subject} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Income} from "../model/income.model";
import {Injectable} from "@angular/core";
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class IncomeService {
  private incomes: Income[] = [];
  private incomesUpdated = new Subject<Income[]>(); // Subject to notify subscribers about income updates

  constructor(private httpClient: HttpClient) {
  }

  getIncomesUpdatedListener(): Observable<Income[]> {
    return this.incomesUpdated.asObservable();
  }

  fetchIncomes() {
    this.httpClient.get('http://localhost:8080/incomes', {
      observe: 'response',
      responseType: 'json'
    }).pipe(map((res: HttpResponse<any>) => res.body))
      .subscribe(
        (incomes: Income[]) => {
          this.incomes = incomes;
          this.incomesUpdated.next([...this.incomes]);
          console.log(this.incomes);
        });
  }

  addIncome(income: Income) {
    console.log(JSON.stringify(income));
    this.httpClient.post('http://localhost:8080/saveIncome', JSON.stringify(income), {
      observe: 'response',
      responseType: 'text'
    }).subscribe((res) => {
      console.log(res.body);
      // TODO anzeige aktualisieren
      this.incomes.push(income);
      this.incomesUpdated.next([...this.incomes]);
    });
  }

  deleteIncome(id: number) {
    this.httpClient.delete('http://localhost:8080/deleteIncome/' + id, {
      observe: 'response',
      responseType: 'text'
    }).subscribe((res) => {
      console.log(res.body);
      // TODO anzeige aktualisieren
    });
  }
}
