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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExpenseService, DateConverterService],
    });

    expenseService = TestBed.inject(ExpenseService);
    httpTestingController = TestBed.inject(HttpTestingController);
    dateConverterService = TestBed.inject(DateConverterService);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifies that no requests are outstanding after each test
  });


  it('Service created.', () => {
    expect(expenseService).toBeTruthy();
  })

  it('Should fetch categories from the server', () => {

    const mockCategories: string[] = ['Groceries', 'Drugstore', 'Free time', 'Rent', 'Insurance', 'Subscriptions', 'Education'];

    expenseService.fetchCategories();
    const req = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_expense}${environment.endpoint_get_categories}`
    );

    req.flush(mockCategories);

    expenseService.getCategoriesUpdatedListener().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
    });
  });

  it('Should fetch expenses by date', () => {
    const testDate = new Date(2024, 6, 24);
    const isoDateString = dateConverterService.convertToDateString(testDate);
    const mockExpenses: Entry[] = [
      {
        id: 1,
        category: 'GROCERIES',
        description: 'Sushi',
        amount: 10, datePlanned: testDate,
        dateCreated: testDate
      },
      {
        id: 2,
        category: 'RENT',
        description: 'To not be homeless',
        amount: 400,
        datePlanned: testDate,
        dateCreated: testDate
      }]

    expenseService.fetchExpensesByDate(testDate);

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_expense}${environment.endpoint_get_by_date}/${isoDateString}`
    );

    req.flush(mockExpenses);

    expenseService.getExpensesUpdatedListener().subscribe(categories => {
      expect(categories).toEqual(mockExpenses);
    });
  });

  it('Should add an expense successfully', () => {
    const testDate = new Date(2024, 6, 24);
    const mockExpense: Entry = {
      id: 1,
      category: 'Free time',
      description: 'Shopping',
      amount: 50,
      datePlanned: testDate,
      dateCreated: testDate
    };

    expenseService.addExpense(mockExpense, testDate);

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
      expect(expenses[0]).toEqual(mockExpense);
    });

    expenseService.getShowMessageToUserSubject().subscribe((message: NotificationMessageModel) => {
      expect(message.severity).toBe('success');
      expect(message.summary).toBe('Erfolg');
      expect(message.detail).toBe('Ausgabe gespeichert.');
    });
  });

  it('should handle error when adding an expense fails', () => {
    const testDate = new Date(2024, 6, 24);

    // Erstelle eine echte Instanz der Entry-Klasse
    const mockExpense: Entry = {
      id: 1,
      category: 'Free time',
      description: 'Shopping',
      amount: 50,
      datePlanned: testDate,
      dateCreated: testDate
    };

    expenseService.addExpense(mockExpense, testDate);

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_expense}${environment.endpoint_save}`
    );

    req.flush(null, { status: 500, statusText: 'Internal Server Error' });

    expenseService.getShowMessageToUserSubject().subscribe((message: NotificationMessageModel) => {
      expect(message.severity).toBe('error');
      expect(message.summary).toBe('Fehler');
      expect(message.detail).toBe('Ausgabe konnte nicht gespeichert werden.');
    });
  });


});
