import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Income } from "../model/income.model";
import { environment } from "../../environments/environment";
import { Observable, Subject, map } from "rxjs";

@Injectable({ providedIn: 'root' })
export class IncomeService {

    private incomesUpdated = new Subject<Income[]>();
    private incomes: Income[] = [];

    constructor(private httpClient: HttpClient) {

    }

    getIncomesUpdatedListener(): Observable<Income[]> {
        return this.incomesUpdated.asObservable();
    }

    addIncome(income: Income) {

        const URL = `${environment.baseUrl}${environment.endpoint_saveIncome}`
        this.httpClient.post(URL, JSON.stringify(income), { observe: 'response', responseType: 'text' })
            .subscribe((result) => {
                console.log(result);
                this.incomes.push(income);
                this.incomesUpdated.next([...this.incomes]);

            });

    }
    deleteIncome(income: Income) {
        const incomeId = income.id;
        const URL = `${environment.baseUrl}${environment.endpoint_deleteIncome}/${incomeId}`;
        this.httpClient.delete(URL, { observe: 'response', responseType: 'text' })
            .subscribe((result) => {
                console.log(result);
                this.incomes = this.incomes.filter(i => i.id !== incomeId);
                this.incomesUpdated.next([...this.incomes]);
            });
    }



}