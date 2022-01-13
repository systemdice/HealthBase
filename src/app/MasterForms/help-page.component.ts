import { HttpClient, JsonpInterceptor } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.css']
})
export class HelpPageComponent implements OnInit {
data:any=[];
data1:any;
  constructor(public http: HttpClient,@Inject(MAT_DIALOG_DATA) public dataPass: any) { }

  ngOnInit(): void {
//alert(this.dataPass.printType);
    this.http.get('/assets/HelpData.json').subscribe(data => {
      this.data = data;
      for (var i = 0; i < this.data.length; i++) {
        if(this.data[i].name==this.dataPass.printType){
this.data1 = this.data[i];
break;
        }
      }
    });
  }

}
