import { BillService } from './services/bill.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'XMind-bill';
  constructor(private billService: BillService){

  }
}
