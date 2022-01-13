import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyMaster } from '../models/UserData';
import { CompanyMasterDetailsService } from '../Services/comapny-master-details.service';

@Component({
  selector: 'app-company-master-data',
  templateUrl: './company-master-data.component.html',
  styleUrls: ['./company-master-data.component.css']
})
export class CompanyMasterDataComponent implements OnInit {
  companyMasterForm: FormGroup;
  companyMasterObject:CompanyMaster;
  usrName:string;
  parValue:string;
  isEdit:boolean=false;
  constructor(private companyMasterService: CompanyMasterDetailsService,private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.companyMasterForm = new FormGroup({
      UnqueID: new FormControl(''),
      DateStart: new FormControl(''),
      CompanyName: new FormControl(''),
      CompanyID: new FormControl(''),
      Version: new FormControl(''),
      CompanyCompletAddress: new FormControl(''),
      CompanyHeaderName1: new FormControl(''),
      CompanyHeaderName2: new FormControl(''),
      CompanyHeaderName3: new FormControl(''),
      CompanyHeaderName4: new FormControl(''),
      CompanyHeaderName5: new FormControl(''),
      CompanyPhoneNumber1: new FormControl(''),
      CompanyPhoneNumber2: new FormControl(''),
      CompanyEmail1: new FormControl(''),
      CompanyEmail2: new FormControl(''),
      SignOffbyWhom: new FormControl(''),
      VDName: new FormControl(''),
      DBName: new FormControl(''),
      VDURL: new FormControl(''),
      DBURL: new FormControl(''),
      Technology: new FormControl(''),
      SupportProvided: new FormControl(''),
      ConcernPersonEmailIDSysDICE: new FormControl(''),
      Price: new FormControl(''),
      Purchasedate: new FormControl(''),
      Renewaldate: new FormControl(''),
      ExpireDate: new FormControl(''),
      OfferApplied: new FormControl(''),
      LicenceKey: new FormControl(''),
      LicenceType: new FormControl(''),
      CurrentStatus: new FormControl(''),
      DataBackup: new FormControl(''),
      //conguration
      PathoLAB: new FormControl(''),
      Dental: new FormControl(''),
      Sacnning: new FormControl(''),
      Other: new FormControl(''),
      CreatedBy: new FormControl(''),
    });

    this.route.queryParams.subscribe(params => {
      this.usrName = params['username'] || "0";
    });

    this.route.params.subscribe((params) => {
      this.parValue = params['CaseID'];
      //this.usrName = params['username'] || 0;
      // alert('par val:'+ this.usrName);
     if (this.parValue !== "" && this.parValue !== "Addnew" ) {
       this.isEdit = true;
        //let student = this.companyMasterService.getById('321131121');
    this.companyMasterService.getById(this.parValue).subscribe(
      (test) => {
        this.companyMasterObject = test;
        alert('User found Successfully. Your User ID is ' + test.UnqueID);
        this.companyMasterForm.patchValue(this.companyMasterObject);
      });
        
      }
      else{
        this.isEdit = false;
      }
    
    });


   
          
  }
  add(){
    if(this.companyMasterForm.valid){
      //this.companyMasterService.createStudent(this.companyMasterForm.value);
      this.companyMasterService.createStudent(this.companyMasterForm.value).subscribe(
        (test) => {
           alert('User cretaed Successfully. Your User ID is ' + test.UnqueID);
          // this.updateID = null;
          // this.UserRegform.reset();
        });
  
      //alert('successful');
      this.resetForm();
      
    }
  }
  edit(){
    if(this.companyMasterForm.valid){
      //this.companyMasterService.createStudent(this.companyMasterForm.value);
      this.companyMasterService.update('321131121',this.companyMasterForm.value).subscribe(
        (test) => {
           alert('User updated Successfully. Your User ID is ' + test.UnqueID);
          // this.updateID = null;
          // this.UserRegform.reset();
        });
  
      //alert('successful');
      this.resetForm();
      
    }

  }
  resetForm(){
    console.log('reset',this.companyMasterForm)
    this.companyMasterForm.reset();
  }

}
