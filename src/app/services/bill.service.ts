import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill, Category } from '../models/csv.model';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { typeOptions } from './static-data';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  billArray: Bill[] = [];

  categoryOptions: Category[] = [];
  category2name:{ [key: string]: string }  = {};

  typeOptions = typeOptions
  type2name:{ [key: string]: string }  = {};
  

  billChange$:BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    this.initData()
    this.typeOptions.map(val=>{
      this.type2name[val.value] = val.text
    })
  }

  initData() {
    forkJoin([
      this.http.get('./assets/bill.csv', { responseType: 'text' }),
      this.http.get('./assets/categories.csv', { responseType: 'text' })])
      .subscribe(res=>{
        this.billArray = []
        const billToRowArray = res[0].split('\n');
        for (let index = 1; index < billToRowArray.length; index++) {
          const row = billToRowArray[index].split(',');
          this.billArray.push({
            type: Number(row[0]),
            time: Number(row[1]),
            category: row[2],
            amount: Number(row[3]),
          });
        }

        this.categoryOptions = []
        const categoryToRowArray = res[1].split('\n');
        for (let index = 1; index < categoryToRowArray.length; index++) {
          const row = categoryToRowArray[index].split(',');
          const category = {
            value: row[0],
            type: Number(row[1]),
            text: row[2],
          }
          this.category2name[row[0]] = category.text
          this.categoryOptions.push(category);
        }

        this.billChange$.next({
          type:'init'
        })
      })
  }


}
