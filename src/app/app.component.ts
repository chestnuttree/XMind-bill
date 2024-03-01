import { Bill, Category } from './models/csv.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { typeOptions } from './services/static-data';
import { BillService } from './services/bill.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  date = new Date();
  originalData: Bill[] = [];
  tableData: Bill[] = [];

  validateForm!: FormGroup;
  typeOptions = typeOptions;
  categoryOptions: Category[] = [];

  page = {
    size: 20,
    index: 1,
    total: 0,
  };

  isVisible = false;

  totalIncome = 0;
  totalPay = 0;

  expenditureData: Category[] = [];

  constructor(
    public billService: BillService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      time: [null, [Validators.required]],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      category: [null],
    });
    this.initData();
  }

  initData() {
    this.billService.getInitData().subscribe((res) => {
      this.originalData = res.billArray;
      this.categoryOptions = res.categoryOptions;
      this.filterTableData();
    });
  }

  sortByAmount = (a: Bill, b: Bill) => a.amount - b.amount;
  sortByTime = (a: Bill, b: Bill) => a.time - b.time;
  filterByType = (list: number[], item: Bill) =>
    list.some((type) => item.type === type);
  filterByCategory = (list: string[], item: Bill) =>
    list.some((category) => item.category === category);

  trackByTime(_: number, item: Bill): string {
    return item.time + '';
  }

  filterTableData() {
    this.totalIncome = 0;
    this.totalPay = 0;
    // Filter and calculate income and expenses by date
    this.tableData = this.originalData.filter((item) => {
      const flag =
        item.time &&
        this.datePipe.transform(new Date(item.time), 'yyyy-MM') ===
          this.datePipe.transform(this.date, 'yyyy-MM');
      if (flag) {
        item.type === 0
          ? (this.totalPay += item.amount)
          : (this.totalIncome += item.amount);
      }
      return flag;
    });

    //count expenditure
    const expenditureLst = this.tableData.filter(val=>val.type === 0)
     //Count each category
    const groupData = _.groupBy(expenditureLst, 'category');
    this.expenditureData = [];
    for (let item in groupData) {
      this.expenditureData.push({
        value: item,
        text: item ? this.billService.category2name[item] : '其他',
        type: groupData[item][0].type,
        amount: _.sumBy(groupData[item], 'amount'),
      });
    }
    this.expenditureData = _.sortBy(this.expenditureData, function (o) {
      return -(o.amount || 0);
    });
  }

  handleAdd() {
    this.validateForm.reset();
    this.isVisible = true;
    this.validateForm.patchValue({
      type: 0,
      time: new Date(),
    });
  }

  handleSave() {
    if (this.validateForm.valid) {
      const value = this.validateForm.value;
      this.originalData.push({
        ...value,
        time: value.time.getTime(),
        category: value.category || '',
      });
      this.filterTableData();
      this.isVisible = false;
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
    }
  }
}
