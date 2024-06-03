import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Expense } from "../model/expense.model";
import { environment } from "../../environments/environment";
import { Observable, Subject, map } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ExpenseService {

    private expensesUpdated = new Subject<Expense[]>();
    private expenses: Expense[] = [];

    constructor(private httpClient: HttpClient) {

    }

    getExpensesUpdatedListener(): Observable<Expense[]> {
        return this.expensesUpdated.asObservable();
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

