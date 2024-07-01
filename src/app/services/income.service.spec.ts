import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {IncomeService} from './income.service';
import {Entry} from "../model/entry.model";
import {DateConverterService} from './date-converter.service';
import {NotificationMessageModel} from "../model/notification-message.model";
import {environment} from '../../environments/environment';


describe('IncomeService', () => {
  let incomeService: IncomeService;
  let httpTestingController: HttpTestingController;
  let dateConverterService: DateConverterService;
  let testDate: Date;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IncomeService, DateConverterService],
    });

    incomeService = TestBed.inject(IncomeService);
    httpTestingController = TestBed.inject(HttpTestingController);
    dateConverterService = TestBed.inject(DateConverterService);
    testDate = new Date(2024, 6, 24);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create service', () => {
    expect(incomeService).toBeTruthy();
  })

  it('should fetch categories from the server', () => {
    const mockCategories: string[] = ['Salary', 'Pocket Money', 'Aliment', 'Capital Assets', 'Rental'];

    incomeService.fetchCategories();

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_income}${environment.endpoint_get_categories}`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockCategories);

    incomeService.getCategoriesUpdatedListener().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
    });
  });


  it('should fetch incomes by date', () => {
    const isoDateString = dateConverterService.convertToDateString(testDate);
    const mockIncomes: Entry[] = [
      {
        id: 1,
        category: 'Salary',
        description: 'Part-time job',
        amount: 13.5,
        datePlanned: testDate,
        dateCreated: testDate
      },
      {
        id: 2,
        category: 'Pocket Money',
        description: 'Just because',
        amount: 10,
        datePlanned: testDate,
        dateCreated: testDate
      }];

    incomeService.fetchIncomesByDate(testDate);

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_income}${environment.endpoint_get_by_date}/${isoDateString}`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockIncomes);

    incomeService.getIncomesUpdatedListener().subscribe(incomes => {
      expect(incomes).toEqual(mockIncomes);
    });
  });


  it('should add an income successfully', () => {
    const testIncome: Entry = {
      id: 1,
      category: 'Rental',
      description: 'Bonus',
      amount: 500,
      datePlanned: testDate,
      dateCreated: testDate
    };

    incomeService.addIncome(testIncome, testDate);

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_income}${environment.endpoint_save}`
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    const mockResponse = {
      message: 'Income saved successfully'
    };
    req.flush(mockResponse);

    incomeService.getIncomesUpdatedListener().subscribe(incomes => {
      expect(incomes.length).toBe(1);
      expect(incomes[0]).toEqual(testIncome);
    });

    incomeService.getShowMessageToUserSubject().subscribe((message: NotificationMessageModel) => {
      expect(message.severity).toBe('success');
      expect(message.summary).toBe('Erfolg');
      expect(message.detail).toBe('Einnahme gespeichert.');
    });
  });


  it('should handle error when adding an income fails', () => {
    const testIncome: Entry = {
      id: 1,
      category: 'Salary',
      description: 'Part-time',
      amount: 12,
      datePlanned: testDate,
      dateCreated: testDate
    };

    incomeService.addIncome(testIncome, testDate);

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_income}${environment.endpoint_save}`
    );
    expect(req.request.method).toBe('POST');

    req.flush(null, {status: 500, statusText: 'Internal Server Error'});

    incomeService.getShowMessageToUserSubject().subscribe((message: NotificationMessageModel) => {
      expect(message.severity).toBe('error');
      expect(message.summary).toBe('Fehler');
      expect(message.detail).toBe('Einnahme konnte nicht gespeichert werden.');

      httpTestingController.verify();
    });
  });


  it('should update an income successfully', () => {
    const originalIncome: Entry = {
      id: 1,
      category: 'Capital Assets',
      description: 'Interest',
      amount: 500,
      datePlanned: testDate,
      dateCreated: testDate
    };

    const updatedIncome: Entry = {
      ...originalIncome,
      amount: 75,
      description: 'Grocery Shopping'
    };

    incomeService.updateIncome(updatedIncome, testDate);

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_income}${environment.endpoint_update}`
    );

    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    const mockResponse = {
      message: 'Income updated successfully',
      entry: updatedIncome
    };
    req.flush(mockResponse);

    incomeService.getIncomesUpdatedListener().subscribe(incomes => {
      expect(incomes.length).toBe(1);
      expect(incomes[0]).toEqual(updatedIncome);
    });

    incomeService.getShowMessageToUserSubject().subscribe((message: NotificationMessageModel) => {
      expect(message.severity).toBe('success');
      expect(message.summary).toBe('Erfolg');
      expect(message.detail).toBe('Einnahme geändert.');
    });
  });


  it('should handle error when updating an income fails', () => {
    const testIncome: Entry = {
      id: 1,
      category: 'Salary',
      description: 'Overtime',
      amount: 20,
      datePlanned: testDate,
      dateCreated: testDate
    };

    const updatedIncome: Entry = {
      ...testIncome,
      amount: 75,
      description: 'Grocery Shopping'
    };

    incomeService.updateIncome(updatedIncome, testDate);

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_income}${environment.endpoint_update}`
    );
    expect(req.request.method).toBe('PUT');

    req.flush(null, {status: 500, statusText: 'Internal Server Error'});

    incomeService.getShowMessageToUserSubject().subscribe((message: NotificationMessageModel) => {
      expect(message.severity).toBe('error');
      expect(message.summary).toBe('Fehler');
      expect(message.detail).toBe('Einnahme konnte nicht geändert werden.');

      httpTestingController.verify();
    });
  });


  it('should delete incomes successfully', () => {
    const testIncome: Entry = {
      id: 1,
      category: 'Rental',
      description: 'yippie',
      amount: 100,
      datePlanned: testDate,
      dateCreated: testDate
    };

    incomeService.deleteIncome(testIncome);

    const deleteReq = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_income}${environment.endpoint_delete}/${testIncome.id}`
    );
    expect(deleteReq.request.method).toBe('DELETE');

    const mockDeleteResponse = {
      message: 'Income deleted successfully'
    };
    deleteReq.flush(mockDeleteResponse);

    incomeService.getIncomesUpdatedListener().subscribe(incomes => {
      expect(incomes.length).toBe(0);
    });

    incomeService.getShowMessageToUserSubject().subscribe((message: NotificationMessageModel) => {
      expect(message.severity).toBe('success');
      expect(message.summary).toBe('Erfolg');
      expect(message.detail).toBe('Einnahme gelöscht.');
    });
  });


  it('should handle error when deleting an income fails', () => {
    const testIncome: Entry = {
      id: 1,
      category: 'Salary',
      description: 'yippie',
      amount: 500,
      datePlanned: testDate,
      dateCreated: testDate
    };

    incomeService.deleteIncome(testIncome)

    const deleteReq = httpTestingController.expectOne(
      `${environment.baseUrl}${environment.path_income}${environment.endpoint_delete}/${testIncome.id}`
    );

    expect(deleteReq.request.method).toBe('DELETE');

    deleteReq.flush(null, {status: 500, statusText: 'Internal Server Error'});

    incomeService.getShowMessageToUserSubject().subscribe((message: NotificationMessageModel) => {
      expect(message.severity).toBe('error');
      expect(message.summary).toBe('Fehler');
      expect(message.detail).toBe('Einnahme konnte nicht gelöscht werden.');

      httpTestingController.verify();
    });
  });

});
