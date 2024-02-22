import { TestBed, waitForAsync } from '@angular/core/testing';

import { BillService } from './bill.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('BillService', () => {
  let service: BillService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BillService],
    });

    service = TestBed.inject(BillService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve initial data', () => {
    const mockBillData = `type,time,category,amount
                          0,1561910400000,8s0p77c323,5400
                          0,1561910400000,0fnhbcle6hg,1500`;
    const mockCategoryData = `id,type,name
                          1bcddudhmh,0,车贷
                          hc5g66kviq,0,车辆保养`;

    service.getInitData().subscribe((data) => {
      expect(data.billArray).toBeTruthy();
      expect(data.categoryOptions).toBeTruthy();
    });

    const req1 = httpTestingController.expectOne('./assets/bill.csv');
    expect(req1.request.method).toEqual('GET');
    req1.flush(mockBillData);

    const req2 = httpTestingController.expectOne('./assets/categories.csv');
    expect(req2.request.method).toEqual('GET');
    req2.flush(mockCategoryData);

    httpTestingController.verify();
  });
});
