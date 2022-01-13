

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientDetails } from '../models/UserData';
import { PataientDetailMainComponent } from '../pataient-detail-main.component';
import { PatientDetailsService } from '../Services/patient-details.service';

@Component({
  selector: 'app-dialog-box-patient',
  templateUrl: './dialog-box-patient.component.html',
  styleUrls: ['./dialog-box-patient.component.css']
})
export class DialogBoxPatientComponent implements OnInit {

  name = 'Angular';
  states: Array<String> = ['AR', 'AL', 'CA', 'DC'];
  fruits: Array<String> = ['Mango', 'Grapes', 'Strawberry', 'Oranges'];
  favFruitsError: Boolean = true;
  selectedFruitValues = [];
  addrFrom: FormGroup;
  par:string;
  parValue:string;
  action:string;
  local_data:any;
  constructor(private _fb: FormBuilder, public dialog: MatDialog,private route: ActivatedRoute,
    private router: Router, @Inject(MAT_DIALOG_DATA) public data: any, 
    public dialogRef: MatDialogRef<DialogBoxPatientComponent>,public patientDetailsService: PatientDetailsService) {
      if (data) {

        this.local_data = {...data};
    this.action = this.local_data.action;

       //console.log('hi'+ data);
        //alert('my d'+ data.uid);
        this.action = data.operation;
        // alert(data.pp.home.street);
        if(data.uid== undefined )
        {
          this.action = 'Add'
        }
        else
        {
         // this.action = "Update";
        }
        
      }
     }


patientdetail:PatientDetails;
  ngOnInit() {

    this.route.params.subscribe((params) => {
      // console.log(params.keys);
      // console.log(params.keys.length);
      this.parValue=  params['caseType'];;
        //console.log('par val:'+ this.parValue);
      
    });
    this.createForm();
    //console.log('final addrFrom is ', this.addrFrom.value)
    this.patientDetailsService.getById(this.data.uid).subscribe(val=>{
      this.patientdetail =  val;
      //alert(this.patientdetail);
      //console.log(this.patientdetail);
      // this.addrFrom.get('home').patchValue({'FirstName':this.patientdetail.FirstName});
      // this.addrFrom.get('home').patchValue({'Year':this.patientdetail.Year});
      // this.addrFrom.get('home').patchValue({'Month':this.patientdetail.Month});
      // this.addrFrom.get('home').patchValue({'Days':this.patientdetail.Days});
      // this.addrFrom.get('home').patchValue({'Status':this.patientdetail.Status});
      this.addrFrom.get('home').setValue(this.patientdetail);
    })
  }

  employeeIdUpdate = null;
  doAction(doAction:string){
    switch (doAction) {
      case "Add":
        //alert('submitted from do action');
        console.log(this.addrFrom.value);
        this.CreateStudent(this.addrFrom.get('home').value);
          break;
      case "Update":
        this.employeeIdUpdate = this.data.uid;
        this.CreateStudent(this.addrFrom.get('home').value);
        break;
          break;
      case "Delete":
        //alert('Deleted from do action');
        console.log(this.addrFrom.value);
        this.deleteEmployee(this.data.uid);
          break;

          this.dialogRef.close({event:'Cancel'});
  }
}

getUnit(sportKey: string): string {
  return sportKey === undefined ? '?' : sportKey;
}

  CreateStudent(student: PatientDetails) {
    if (this.employeeIdUpdate == null) {
     
      
      this.patientDetailsService.createStudent(student).subscribe(
        () => {
          //this.dataSaved = true;
          //this.massage = 'Record saved Successfully';
          alert('Data saved Successfully');
          //this.loadAllEmployees();
          this.employeeIdUpdate = null;
          this.addrFrom.reset();
        });
    } else {
      //employee.EmpId = this.row.id;
      //student.UnqueID = this.data.row.UnqueID;
      var id= this.employeeIdUpdate;
      //var p = student.UnqueID;
      this.patientDetailsService.update(id,student).subscribe(() => {
        // this.dataSaved = true;
        // this.massage = 'Record Updated Successfully';
        //this.loadAllEmployees();
        alert('Data updated Successfully');
        this.employeeIdUpdate = null;
        this.addrFrom.reset();
      });
    }
    this.closeDialog();
  }

  deleteEmployee(employeeId: string) {
    if (confirm("Are you sure you want to delete this ?")) {
      //employeeId = "229";
      this.patientDetailsService.delete(employeeId).subscribe(() => {
        // this.dataSaved = true;
        // this.massage = 'Record Deleted Succefully';
        //this.loadAllEmployees();
        this.employeeIdUpdate = null;
        this.addrFrom.reset();
        this.dialogRef.close({event:'Cancel'});

      });
    }

  }

  createForm() {
    this.addrFrom = this._fb.group({
      home: this._fb.group({
        UnqueID: [''],
        Id: [''],
        Title : [''],
        UserName : [''],
        FirstName : [''],
        LastName : [''],
        Year : [''],
        Month : [''], 
        Days : [''],
Status:['true'],
        Gender : ['1'],
        Email : [''],
        ContactNumber : [''],
        Address : [''],
        DOB: [],
        CaseID  : [''],
                                 BedID  : [''],
                                 TestID : [''],
                                 NewID : [''],
                                 OtherID : [''],
                                 Doctorfees : [''],
                                 HospitalDiscount : [''],
                                 GrandTotal : [''],
                                 TreatmentContinue : [''],
                                 AssignDoctor : [''],
        Relationship: ['Self'],
        Pregnancy: [false],
        PatientCategory: [''],
        RefferDoctorName: [''],
        PermananetAddress: [''],
        OfficeAddress: [''],
        MaritalStatus: [''],
        CO: [''],
        Religion: [''],
        Occupation: [''],
        BloodGroup: [''],
        AssignedPharma: [''],
        AssignedDept: [''],
        Allergy: [''],
        Height: [''],
        Weight: [''],
        Temperature: [''],
        RespiratoryRate: [''],
        RhType: [''],
        BPReading: [''],
        FatherName: [''],
        MotherName: [''],
        AdvPayment: [''],
        AppointmentID:[''],
        
      }),

      


    })
  }

  SavePP(){
    //this.pataientDetailMainComponent.SavePatientDetails();
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

  addFruitsControls() {
    const arr = this.fruits.map(item => {
      return this._fb.control(false);
    });

    return this._fb.array(arr);
  }

  addAddressGroup() {
    return this._fb.group({
      primaryFlg: [],
      streetAddress: [null, Validators.required],
      city: [null, Validators.required],
      state: [null, Validators.required],
      zipcode: [null, [Validators.required, Validators.pattern('^[0-9]{5}$')]]
    });
  }

}
