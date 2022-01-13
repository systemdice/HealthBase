import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-bill-management',
  templateUrl: './bill-management.component.html',
  styleUrls: ['./bill-management.component.css']
})
export class BillManagementComponent implements OnInit {

  myTestData:string="sysdice";
  patientComponent:boolean;
   constructor() { }

  ngOnInit() {
    this.patientComponent = false;
  }

  printPage() {
    window.print();
    this.myTestData ="Anshu"
  }
 

}
