import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill, Category } from '../models/csv.model';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  billArray: Bill[] = [];
  categoryOptions: Category[] = [];

  constructor(private http: HttpClient) {
    this.getBillData()
    this.getCategoryData()
  }

  getBillData(){
    this.http
    .get('./assets/bill.csv', { responseType: 'text' })
    .subscribe((res) => {
      this.billArray = []
      const csvToRowArray = res.split('\n');
      for (let index = 1; index < csvToRowArray.length; index++) {
        const row = csvToRowArray[index].split(',');
        this.billArray.push({
          time: Number(row[0]),
          type: Number(row[1]),
          category: row[2],
          amount: Number(row[3]),
        });
      }
    });
  }

  getCategoryData(){
    this.http
    .get('./assets/categories.csv', { responseType: 'text' })
    .subscribe((res) => {
      this.categoryOptions = []
      const csvToRowArray = res.split('\n');
      for (let index = 1; index < csvToRowArray.length; index++) {
        const row = csvToRowArray[index].split(',');
        this.categoryOptions.push({
          id: row[0],
          type: Number(row[1]),
          name: row[2],
        });
      }
    });
  }


}
