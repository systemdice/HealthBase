import { Component, OnInit } from '@angular/core';
import { NewModifyCase } from '../models/UserData';
import { AddModifyCaseService } from '../Services/add-modify-case.service';

@Component({
  selector: 'app-case-payment-filter',
  templateUrl: './case-payment-filter.component.html',
  styleUrls: ['./case-payment-filter.component.css']
})
export class CasePaymentFilterComponent implements OnInit {
  asyncPipeNewModifyCase: NewModifyCase[] = [];
  asyncPipeNewModifyCaseZero: NewModifyCase[] = [];
  asyncPipeNewModifyCaseDue: NewModifyCase[] = [];
  asyncPipeNewModifyCaseRef: NewModifyCase[] = [];
  NDaysData:number=5;
  constructor(private addModifyCaseService: AddModifyCaseService,) { }

  ngOnInit(): void {
    this.LoadNDaysData(5);
    //this.LoadAllCases();
  }
  LoadNDaysData(noofdays:number){
    this.addModifyCaseService.getLastNDaysCase(noofdays).subscribe((data: NewModifyCase[]) => {
      this.asyncPipeNewModifyCaseZero = data.filter(a=>  a.PaymentHistory[0]?.Balance == 0)
      this.asyncPipeNewModifyCaseDue = data.filter(a=>  a.PaymentHistory[0]?.Balance > 0)
      this.asyncPipeNewModifyCaseRef = data.filter(a=>  a.PaymentHistory[0]?.Balance < 0)

    })
  }
  LoadAllCases(){
    this.addModifyCaseService.getAll().subscribe((data: NewModifyCase[]) => {
      //console.log('jay'+data);
      this.asyncPipeNewModifyCase = data;
        
      this.asyncPipeNewModifyCaseZero = data.filter(a=>  a.PaymentHistory[0]?.Balance == 0)
      this.asyncPipeNewModifyCaseDue = data.filter(a=>  a.PaymentHistory[0]?.Balance > 0)
      this.asyncPipeNewModifyCaseRef = data.filter(a=>  a.PaymentHistory[0]?.Balance < 0)
     
    });
  }

}
