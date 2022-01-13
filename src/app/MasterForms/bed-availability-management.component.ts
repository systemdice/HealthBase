import { stringify } from '@angular/compiler/src/util';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms'
import { BedManagement, BedReport } from '../models/UserData';
import { AddModifyCaseService } from '../Services/add-modify-case.service';
import { BedManagementService } from '../Services/bed-management.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from '../MasterForms/DoctorNursePatho/doctot-patient-assignment.component';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bed-availability-management',
  templateUrl: './bed-availability-management.component.html',
  styleUrls: ['./bed-availability-management.component.css']
})
export class BedAvailabilityManagementComponent implements OnInit {

  asyncPipeBedReport: BedManagement[] = [];
  asyncPipeBedReportBackup: BedManagement[] = [];
  asyncPipeBedReportActual: BedReport[] = [];

  ngOnInit(): void {
    this.LoadAllBeds();
  }
  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }
  title = 'FormArray SetValue & PatchValue Example';
 
  teachersForm: FormGroup;
 
  constructor(private _router: Router,private fb: FormBuilder,public bedManagementService:BedManagementService,private addModifyCaseService: AddModifyCaseService,
    public dialogRef: MatDialogRef<BedAvailabilityManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private datePipe: DatePipe) {
      //this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy').toString();
    this.teachersForm = this.fb.group({
      teachers: this.fb.array([]),
    })
  }
 LoadAllBeds(){

  this.bedManagementService.getAll().subscribe((data: BedManagement[]) => {
    this.asyncPipeBedReport = data;
    this.asyncPipeBedReportBackup = data;
  });

  // this.addModifyCaseService.getAdmitted().subscribe((data: BedReport[]) => {
  //   this.asyncPipeBedReportActual = data;
  //   this.bedManagementService.getAll().subscribe((data: BedManagement[]) => {
  //     this.asyncPipeBedReport = data;
  //     this.asyncPipeBedReportBackup = data;
  //   });
  // });
  
 }


 findName(nm){
   var retVal:String='';
  var p = this.asyncPipeBedReportActual.find(a=>a.BedName==nm);
  if(p !== undefined)
  {
    retVal = p.PatientName;
  }
  return retVal;
 }
 findOPDIPDid(nm){
  var retVal:String='';
 var p = this.asyncPipeBedReportActual.find(a=>a.BedName==nm);
 if(p !== undefined)
 {
   retVal = p.OPDIPDid;
 }
 return retVal;
}

findUnqueid(nm){
  var retVal:String='';
 var p = this.asyncPipeBedReportActual.find(a=>a.BedName==nm);
 if(p !== undefined)
 {
   retVal = p.UnqueID;
 }
 return retVal;
}
 
  /** Teachers */
  teachers(): FormArray {
    return this.teachersForm.get("teachers") as FormArray
  }
 
  newTeacher(): FormGroup {
    return this.fb.group({
      name: '',
      batches: this.fb.array([])
    })
  }
 
 
  addTeacher() {
    this.teachers().push(this.newTeacher());
  }
 
 
  removeTeacher(ti) {
    this.teachers().removeAt(ti);
  }
 
 
  /** batches */
 
  batches(ti): FormArray {
    return this.teachers().at(ti).get("batches") as FormArray
  }
 
 
  newBatch(): FormGroup {
    return this.fb.group({
      name: '',
      students: this.fb.array([])
    })
  }
 
  addBatch(ti: number) {
    this.batches(ti).push(this.newBatch());
  }
 
  removeBatch(ti: number, bi: number) {
    this.batches(ti).removeAt(ti);
  }
 
  /** students */
 
  students(ti, bi): FormArray {
    return this.batches(ti).at(bi).get("students") as FormArray
  }
 
  newStudent(): FormGroup {
    return this.fb.group({
      name: '',
    })
  }
 
  addStudent(ti: number, bi: number) {
    this.students(ti, bi).push(this.newStudent());
  }
 
  removeStudent(ti: number, bi: number, si: number) {
    this.students(ti, bi).removeAt(si);
  }
 
  onSubmit() {
    console.log(this.teachersForm.value);
  }
  data1:any = {
    teachers:[
      {
        "name": "Teacher 1",
        "batches": [
          {
            "name": "Batch No 1",
            "students": [
              {
                "name": "Ramesh"
              },
              {
                "name": "Suresh"
              },
              {
                "name": "Naresh"
              }
            ]
          },
          {
            "name": "Batch No 2",
            "students": [
              {
                "name": "Vikas"
              },
              {
                "name": "Harish"
              },
              {
                "name": "Lokesh"
              }
            ]
          }
        ]
      },
      {
        "name": "teacher2",
        "batches": [
          {
            "name": "batch2",
            "students": [
              {
                "name": "st1st2"
              },
              {
                "name": "st2"
              }
            ]
          },
          {
            "name": "batch3",
            "students": []
          }
        ]
      }
    ]
  }

  patchValue2() {
 
    var data = {
      teachers:[
        {
          "name": "Teacher 1",
          "batches": [
            {
              "name": "Batch No 1",
              "students": [
                {
                  "name": "Ramesh"
                },
                {
                  "name": "Suresh"
                },
                {
                  "name": "Naresh"
                }
              ]
            },
            {
              "name": "Batch No 2",
              "students": [
                {
                  "name": "Vikas"
                },
                {
                  "name": "Harish"
                },
                {
                  "name": "Lokesh"
                }
              ]
            }
          ]
        },
        {
          "name": "teacher2",
          "batches": [
            {
              "name": "batch2",
              "students": [
                {
                  "name": "st1st2"
                },
                {
                  "name": "st2"
                }
              ]
            },
            {
              "name": "batch3",
              "students": []
            }
          ]
        }
      ]
    }
    this.clearFormArray();
   
   
    data.teachers.forEach(t => {
   
      var teacher: FormGroup = this.newTeacher();
      this.teachers().push(teacher);
   
      t.batches.forEach(b => {
        var batch = this.newBatch();
   
        (teacher.get("batches") as FormArray).push(batch)
   
        b.students.forEach(s => {
          (batch.get("students") as FormArray).push(this.newStudent())
        })
   
      });
    });
   
    this.teachersForm.patchValue(data);
  }
   
   
  clearFormArray() {
   
    //Angular 8 +
    this.teachers().clear();
   
    //older Versions of angualar
    //while (this.teachers().length) {
    //  this.teachers().removeAt(0);
    //}
  }

  object:any = []
  object1:any = []
  object2:any = []
  newTeacherArr(t:any): any {
    return {
      name: t.name,
      price: ''
    }
  }
  CreateArr(){
    this.data1.teachers.forEach(t => {
 
      var teacher: any = this.newTeacherArr(t);
      this.object.push(teacher);
   
      t.batches.forEach(b => {
        this.object1.push(b);
   
        b.students.forEach(s => {
          this.object2.push(s);
        })
   
      });
    });
   
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  CloseMe(){
    this._router.navigate(['/home', 37], { queryParams: { username: "ax3r5!mmmt!4rtresjjgnth"}});
    this.dialogRef.close();
  }
 
}
 


