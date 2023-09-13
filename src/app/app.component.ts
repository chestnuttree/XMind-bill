import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Bill, Category } from './models/csv.model';
import { BillService } from './services/bill.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import  * as _ from "lodash";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'XMind-bill';
  date = new Date()
  total = 1;
  orinData: Bill[] = [];
  tableData: Bill[] = [];
  currentData: readonly Bill[] = [];
  pageSize = 20;
  pageIndex = 1;
  validateForm!: FormGroup;

  isVisible = false

  totalIncome = 0
  totalPay = 0

  categoryTable: Category[] = [];

  constructor(public billService: BillService,private fb: FormBuilder,private datePipe: DatePipe){
    this.billService.billChange$.subscribe(()=>{
      this.orinData = JSON.parse(JSON.stringify(this.billService.billArray)) 
      this.filterTableData()
    })
  }
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      time: [null, [Validators.required]],
      type: [null, [Validators.required]],
      amount: [null,[Validators.required]],
      category: [null],
    });
  }

  sortByAmount  = (a: Bill, b: Bill) => a.amount - b.amount
  sortByTime = (a: Bill, b: Bill) => a.time - b.time
  filterByType = (list: number[], item: Bill) => list.some(type => item.type === type)
  filterByCategory = (list: string[], item: Bill) => list.some(category => item.category === category)

  trackByTime(_: number, item: Bill): string {
    return item.time+'';
  }

  filterTableData() {
    this.totalIncome = 0
    this.totalPay = 0
    this.tableData = this.orinData.filter(item=>{
      const flag = item.time && this.datePipe.transform(new Date(item.time), "yyyy-MM") === this.datePipe.transform(this.date, "yyyy-MM")
      if(flag) {
        item.type === 0?(this.totalPay+=item.amount):(this.totalIncome+=item.amount)
      }
      return flag
    })

    const groupData = _.groupBy(this.tableData,'category')
    console.log(groupData);
    
    this.categoryTable = []
    for (let item in groupData) {
      this.categoryTable.push({
        value:item,
        text:item!=='null'?this.billService.category2name[item]:'其他',
        type:groupData[item][0].type,
        amount: _.sumBy(groupData[item],'amount')
      })
    }
    this.categoryTable = _.sortBy(this.categoryTable,function(o) {return -(o.amount || 0);})
  }

  handleAdd() {
    this.validateForm.reset()
    this.isVisible = true
    this.validateForm.patchValue({
      type:0,
      time: new Date()
    })
  }

  handleSave() {
    if (this.validateForm.valid) {
      const value = this.validateForm.value
      this.billService.billArray.unshift(
        {...value,time:value.time.getTime()}
      )
      this.billService.billChange$.next('')
      this.isVisible = false

    } else {
     Object.values(this.validateForm.controls).forEach(control => {
       if (control.invalid) {
         control.markAsDirty();
         control.updateValueAndValidity();
       }
     });
   }

  }

  onCurrentPageDataChange(listOfCurrentPageData: readonly Bill[]): void {
    this.currentData = listOfCurrentPageData;
  }

}
