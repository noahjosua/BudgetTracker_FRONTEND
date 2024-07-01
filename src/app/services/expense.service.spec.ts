import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ExpenseService} from './expense.service';
import {Entry} from "../model/entry.model";
import {DateConverterService} from './date-converter.service';
import {NotificationMessageModel} from "../model/notification-message.model";
import {environment} from '../../environments/environment';


describe('ExpenseService', () => {
  let expenseService: ExpenseService;
  let httpTestingController: HttpTestingController;
  let dateConverterService: DateConverterService;
  let testDate: Date;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExpenseService, DateConverterService],
    });

    expenseService = TestBed.inject(ExpenseService);
    httpTestingController = TestBed.inject(HttpTestingController);
    dateConverterService = TestBed.inject(DateConverterService);
    testDate = new Date(2024, 6, 24);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create service', () => {
    expect(expenseService).toBeTruthy();
  })


  it('should fetch categories from the server', () => {
    const mockCategories: string[] = ['Groceries', 'Drugstore', 'Free time', 'Rent', 'Insurance', 'Subscriptions', 'Education'];

    expenseService.fetchCategories();

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_expense}${environment.endpoint_get_categories}`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockCategories);

    expenseService.getCategoriesUpdatedListener().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
    });
  });


  it('should fetch expenses by date', () => {
    const isoDateString = dateConverterService.convertToDateString(testDate);
    const mockExpenses: Entry[] = [
      {
        id: 1,
        category: 'Groceries',
        description: 'Shopping',
        amount: 50,
        datePlanned: testDate,
        dateCreated: testDate
      },
      {
        id: 2,
        category: 'Rent',
        description: 'Rent payment',
        amount: 1000,
        datePlanned: testDate,
        dateCreated: testDate
      }];

    expenseService.fetchExpensesByDate(testDate);

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_expense}${environment.endpoint_get_by_date}/${isoDateString}`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockExpenses);

    expenseService.getExpensesUpdatedListener().subscribe(expenses => {
      expect(expenses).toEqual(mockExpenses);
    });
  });


  it('should add an expense successfully', () => {
    const testExpense: Entry = {
      id: 1,
      category: 'Free time',
      description: 'Shopping',
      amount: 50,
      datePlanned: testDate,
      dateCreated: testDate
    };

    expenseService.addExpense(testExpense, testDate);

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_expense}${environment.endpoint_save}`
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    const mockResponse = {
      message: 'Expense saved successfully'
    };
    req.flush(mockResponse);

    expenseService.getExpensesUpdatedListener().subscribe(expenses => {
      expect(expenses.length).toBe(1);
      expect(expenses[0]).toEqual(testExpense);
    });

    expenseService.getShowMessageToUserSubject().subscribe((message: NotificationMessageModel) => {
      expect(message.severity).toBe('success');
      expect(message.summary).toBe('Erfolg');
      expect(message.detail).toBe('Ausgabe gespeichert.');
    });
  });


  it('should handle error when adding an expense fails', () => {
    const testExpense: Entry = {
      id: 1,
      category: 'Free time',
      description: 'Shopping',
      amount: 50,
      datePlanned: testDate,
      dateCreated: testDate
    };

    expenseService.addExpense(testExpense, testDate);

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_expense}${environment.endpoint_save}`
    );
    expect(req.request.method).toBe('POST');

    req.flush(null, {status: 500, statusText: 'Internal Server Error'});

    expenseService.getShowMessageToUserSubject().subscribe((message: NotificationMessageModel) => {
      expect(message.severity).toBe('error');
      expect(message.summary).toBe('Fehler');
      expect(message.detail).toBe('Ausgabe konnte nicht gespeichert werden.');

      httpTestingController.verify();
    });
  });


  it('should update an expense successfully', () => {
    const originalExpense: Entry = {
      id: 1,
      category: 'Free time',
      description: 'Shopping',
      amount: 50,
      datePlanned: testDate,
      dateCreated: testDate
    };

    const updatedExpense: Entry = {
      ...originalExpense,
      amount: 75,
      description: 'Grocery Shopping'
    };

    expenseService.updateExpense(updatedExpense, testDate);

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_expense}${environment.endpoint_update}`
    );

    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    const mockResponse = {
      message: 'Expense updated successfully',
      entry: updatedExpense
    };
    req.flush(mockResponse);

    expenseService.getExpensesUpdatedListener().subscribe(expenses => {
      expect(expenses.length).toBe(1);
      expect(expenses[0]).toEqual(updatedExpense);
    });

    expenseService.getShowMessageToUserSubject().subscribe((message: NotificationMessageModel) => {
      expect(message.severity).toBe('success');
      expect(message.summary).toBe('Erfolg');
      expect(message.detail).toBe('Ausgabe geändert.');
    });
  });


  it('should handle error when updating an expense fails', () => {
    const testExpense: Entry = {
      id: 1,
      category: 'Free time',
      description: 'Shopping',
      amount: 50,
      datePlanned: testDate,
      dateCreated: testDate
    };

    const updatedExpense: Entry = {
      ...testExpense,
      amount: 75,
      description: 'Grocery Shopping'
    };

    expenseService.updateExpense(updatedExpense, testDate);

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_expense}${environment.endpoint_update}`
    );
    expect(req.request.method).toBe('PUT');

    req.flush(null, {status: 500, statusText: 'Internal Server Error'});

    expenseService.getShowMessageToUserSubject().subscribe((message: NotificationMessageModel) => {
      expect(message.severity).toBe('error');
      expect(message.summary).toBe('Fehler');
      expect(message.detail).toBe('Ausgabe konnte nicht geändert werden.');

      httpTestingController.verify();
    });
  });


  it('should delete expense successfully', () => {
    const testExpense: Entry = {
      id: 1,
      category: 'Free time',
      description: 'Shopping',
      amount: 50,
      datePlanned: testDate,
      dateCreated: testDate
    };

    expenseService.deleteExpense(testExpense);

    const deleteReq = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_expense}${environment.endpoint_delete}/${testExpense.id}`
    );
    expect(deleteReq.request.method).toBe('DELETE');

    const mockDeleteResponse = {
      message: 'Expense deleted successfully'
    };
    deleteReq.flush(mockDeleteResponse);

    expenseService.getExpensesUpdatedListener().subscribe(expenses => {
      expect(expenses.length).toBe(0);
    });

    expenseService.getShowMessageToUserSubject().subscribe((message: NotificationMessageModel) => {
      expect(message.severity).toBe('success');
      expect(message.summary).toBe('Erfolg');
      expect(message.detail).toBe('Ausgabe gelöscht.');
    });
  });


  it('should handle error when deleting an expense fails', () => {
    const testExpense: Entry = {
      id: 1,
      category: 'Free time',
      description: 'Shopping',
      amount: 50,
      datePlanned: testDate,
      dateCreated: testDate
    };

    expenseService.deleteExpense(testExpense)

    const deleteReq = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_expense}${environment.endpoint_delete}/${testExpense.id}`
    );

    expect(deleteReq.request.method).toBe('DELETE');

    deleteReq.flush(null, {status: 500, statusText: 'Internal Server Error'});

    expenseService.getShowMessageToUserSubject().subscribe((message: NotificationMessageModel) => {
      expect(message.severity).toBe('error');
      expect(message.summary).toBe('Fehler');
      expect(message.detail).toBe('Ausgabe konnte nicht gelöscht werden.');

      httpTestingController.verify();
    });
  });

});
