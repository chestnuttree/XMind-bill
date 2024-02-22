import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { typeOptions } from './static-data';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  category2name:{ [key: string]: string }  = {};
  type2name:{ [key: string]: string }  = {};
  
  constructor(private http: HttpClient) {
    typeOptions.map(val=>{
      this.type2name[val.value] = val.text
    })
  }
  getInitData() {
    return forkJoin([
      this.http.get('./assets/bill.csv', { responseType: 'text' }),
      this.http.get('./assets/categories.csv', { responseType: 'text' })]).pipe(map((res)=>{

        const categoryOptions = []
        const categoryToRowArray = res[1].split('\n');
        for (let index = 1; index < categoryToRowArray.length; index++) {
          const row = categoryToRowArray[index].split(',');
          const category = {
            value: row[0],
            type: Number(row[1]),
            text: row[2],
          }
          this.category2name[row[0]] = category.text
          categoryOptions.push(category);
        }

        const billArray = []
        const billToRowArray = res[0].split('\n');
        for (let index = 1; index < billToRowArray.length; index++) {
          const row = billToRowArray[index].split(',');
          const type = Number(row[0])
          const typeData = typeOptions.find(val=>val.value == type)
          billArray.push({
            type: type,
            time: Number(row[1]),
            category: row[2],
            amount: Number(row[3]),
            categoryName: this.category2name[row[2]]?this.category2name[row[2]]:'其他',
            typeName: typeData?.text
          });
        }
        return {
          billArray,
          categoryOptions
        }
      }))
  }

}
