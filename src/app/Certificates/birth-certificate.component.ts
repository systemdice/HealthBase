import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllMasterFixedData } from '../shared/AllConstants';

@Component({
  selector: 'app-birth-certificate',
  templateUrl: './birth-certificate.component.html',
  styleUrls: ['./birth-certificate.component.css']
})
export class BirthCertificateComponent implements OnInit {
underScoreLength1:string= "_____________________";
underScoreLength2:string= "____________";
underScoreLength3:string= "__________________";

Addressline1= AllMasterFixedData.Addressline1;
    Addressline2= AllMasterFixedData.Addressline2;
    Addressline3= AllMasterFixedData.Addressline3;
    Addressline4= AllMasterFixedData.Addressline4;
  constructor(private _router: Router) { }

  ngOnInit(): void {
  }
  CloseMe(){
    this._router.navigate(['/home', 37], { queryParams: { username: "ax3r5!mmmt!4rtresjjgnth"}});
  }

  myPrint(myfrm) {
    document.getElementById("printElement").style.display = "none";
    document.getElementById("CloseMe").style.display = "none";
    var printdata = document.getElementById(myfrm);
    var newwin = window.open("");
    newwin.document.write(printdata.outerHTML);
    newwin.print();
    document.getElementById("printElement").style.display = "block";
    document.getElementById("CloseMe").style.display = "block";
    newwin.close();
  }

}