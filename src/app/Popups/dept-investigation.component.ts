import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { RatelistDetails } from './ratelist-details';

import * as _ from "lodash";
import { User, UserRegistartion } from '../models/UserData';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { gender } from '../models/AllConstansts';


interface DialogData {
  id: number;
  email: string;
  name: string;
  category: string,
  row: any;
  AddEdit: string;
}

export interface Hobby {
  id: number;
  name: string;
}


interface Category {
  id: number;
  name: string;
}
interface Classes {
  id: number;
  name: string;
}

@Component({
  selector: 'app-dept-investigation',
  templateUrl: './dept-investigation.component.html',
  styleUrls: ['./dept-investigation.component.css']
})
export class DeptInvestigationComponent implements OnInit {
  public breakpoint: number; // Breakpoint observer code
  public breakpoint2: number; // Breakpoint observer code
   public addLabRate: FormGroup;
  wasFormChanged = false;
  animal: any;
  //dialogRef: any;
  AddorEdit: string = 'Edit ';
  dataSaved = false;
  employeeForm: any;
  allEmployees: Observable<UserRegistartion[]>;
  employeeIdUpdate = null;
  massage = null;
  
  row: User;
  
  
  
  selectedCountry: string = "GB";
  selectedCountryControl = new FormControl(this.selectedCountry);
  selectedCountryControlT2 = new FormControl(this.selectedCountry);
  selectedCountryControlT3 = new FormControl(this.selectedCountry);
  selectedCountryControlT4 = new FormControl(this.selectedCountry);
  gender: gender[] = [
    { id: 'm', name: 'Male' },
    { id: 'f', name: 'Female' },
    { id: 'b', name: 'Both' }
  ]; 

  //chiplist
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput',{static:true}) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto',{static:true}) matAutocomplete: MatAutocomplete;
  //ended here



  constructor(
    private fb: FormBuilder, private userService: AuthService, private cd: ChangeDetectorRef,
    public dialog: MatDialog, public dialogRef: MatDialogRef<DeptInvestigationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
//this.gender = ['Male', 'Female'];
this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
  startWith(null),
  map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
    
 }
 //started for chip
 add(event: MatChipInputEvent): void {
  const input = event.input;
  const value = event.value;

  // Add our fruit
  if ((value || '').trim()) {
    this.fruits.push(value.trim());
    //this.addLabRate.patchValue(fruitCtrl) = this.fruits
  }

  // Reset the input value
  if (input) {
    input.value = '';
  }

  this.fruitCtrl.setValue(null);
}

remove(fruit: string): void {
  const index = this.fruits.indexOf(fruit);

  if (index >= 0) {
    this.fruits.splice(index, 1);
  }
}

selected(event: MatAutocompleteSelectedEvent): void {
  this.fruits.push(event.option.viewValue);
  this.fruitInput.nativeElement.value = '';
  this.fruitCtrl.setValue(null);
}

private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();

  return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
}
 //ended here
  public ngOnInit(): void {
    
    //const controls = this.studentHobbyData.map(c => new FormControl(false));
    //controls[2].setValue(true);
    //controls[3].setValue(true);
    

    this.addLabRate = this.fb.group({
      //IdProof: null,
      testName: ['', [Validators.required]],
      fee: [''],
      testForGender: [''],
      fruitCtrl:[],
      Active:[],
     
      ShouldCommit: ['true'],
      //file: [null]
    });
    //this.addHobbyCheckboxes();
    //this.Repopulate(controls);
    this.breakpoint = window.innerWidth <= 600 ? 1 : 3; // Breakpoint observer code
    this.breakpoint2 = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code
    //this.studentHobbyData[1].is_selected = true;
    //this.studentHobbyData[2].is_selected = true;

    //alert(this.data.row.firstName);
    if (this.data.AddEdit == 'Add') {
      this.AddorEdit = 'Add new entry to Lab Ratelist';
      this.employeeIdUpdate = null;
    }
    else {
      this.employeeIdUpdate = 'yes';
      //this.row = this.data.user;
      this.loadEmployeeToEdit(this.data.row);
      //this.row['Name'] = '';
      //alert(JSON.stringify(this.data.row));
      //alert(this.data.row.id ='---'+ this.data.id);
    }
  }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  createHobbies(hobbiesInputs) {
    const arr = hobbiesInputs.map(hobby => {
      return new FormControl(hobby.selected || false);
    });
    return new FormArray(arr);
  }

  
 

  public onAddCus(): void {
    this.markAsDirty(this.addLabRate);
  }

  @ViewChild('fileInput', {static:true}) el: ElementRef;
  imageUpload: any = 'https://i.pinimg.com/236x/d6/27/d9/d627d9cda385317de4812a4f7bd922e9--man--iron-man.jpg';
  imageFileName: any;
  editFile: boolean = true;
  removeUpload: boolean = false;
  imageUrl: any;

  handleFileInput(files: FileList) {
    this.imageUpload = files.item(0);
    this.imageFileName = "xyz";
    //saveAs(this.imageUpload,'../assets/images/xyz1.png');
    // how to use FileSaver here ? 
    //this.imageUpload doesn't have data or something like this
    //var data = new Blob([this.imageUpload], { 'your file type here' });
    //saveAs(this.imageUpload, '../assets/images/xyz1.png');  

  }

 
  base64File: string = null;
  filename: string = null;
  onFileSelect(e: any): void {
    try {
      const file = e.target.files[0];
      const fReader = new FileReader()
      fReader.readAsDataURL(file)
      fReader.onloadend = (_event: any) => {
        this.filename = file.name;
        this.base64File = _event.target.result;
      }
      //saveAs(file, 'c:\aa.png');
    } catch (error) {
      this.filename = null;
      this.base64File = null;
      //console.log('no file was selected...');
    }
  }

  uploadFile(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.addLabRate.patchValue({
          file: reader.result
        });
        this.editFile = false;
        this.removeUpload = true;

        const blob = new Blob([reader.result]);
        //saveAs(blob, 'out.bmp');
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }



  
  // tslint:disable-next-line:no-any
  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

  private markAsDirty(group: FormGroup): void {
    group.markAsDirty();
    // tslint:disable-next-line:forin
    for (const i in group.controls) {
      group.controls[i].markAsDirty();
    }
    this.dialog.closeAll();
  }

  formChanged() {
    this.wasFormChanged = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.data.name = "Jay jagganath";
    //this.data.email = "badathakura@puri.com";
  }
  
  
  onFormSubmit() {
    
    const student = this.addLabRate.value;    
    this.CreateStudent(student);
    this.addLabRate.reset();

    
  }
  loadEmployeeToEdit(employee: UserRegistartion) {
    this.massage = null;
    this.dataSaved = false;
    this.employeeIdUpdate = employee.UnqueID;
    this.addLabRate.controls['Username'].setValue(employee.Username);
    this.addLabRate.controls['Category'].setValue(employee.Category);
    this.addLabRate.controls['FirstName'].setValue(employee.FirstName);
    this.addLabRate.controls['LastName'].setValue(employee.LastName);
    this.addLabRate.controls['Gender'].setValue(employee.Gender);
    this.addLabRate.controls['ContactNumber'].setValue(employee.ContactNumber);
    this.addLabRate.controls['Country'].setValue(employee.Country);
    this.addLabRate.controls['State'].setValue(employee.State);
    this.addLabRate.controls['EmailAddress'].setValue(employee.EmailAddress);
    this.addLabRate.controls['Address'].setValue(employee.Address);
    // this.addLabRate.controls['healthDetails'].setValue(employee.healthDetails);
    this.addLabRate.controls['DateStart'].setValue(employee.DateStart);
    this.addLabRate.controls['DateEnd'].setValue(employee.DateEnd);
    this.addLabRate.controls['Active'].setValue(employee.Active);
    //this.Repopulate(employee.Role);
  }  

  CreateStudent(student: UserRegistartion) {
    if (this.employeeIdUpdate == null) {
      student.DateStart = new Date(student.DateStart).toUTCString();
      student.DateEnd = new Date(student.DateStart);
      // this.userService.createStudent(student).subscribe(
      //   () => {
      //     this.dataSaved = true;
      //     this.massage = 'Record saved Successfully';
      //     alert('Student data saved Successfully');
      //     //this.loadAllEmployees();
      //     this.employeeIdUpdate = null;
      //     this.addLabRate.reset();
      //   });
    } else {
      //employee.EmpId = this.row.id;
      student.UnqueID = this.data.row.UnqueID;
      // this.userService.updateStudent(student.UnqueID,student).subscribe(() => {
      //   this.dataSaved = true;
      //   this.massage = 'Record Updated Successfully';
      //   //this.loadAllEmployees();
      //   this.employeeIdUpdate = null;
      //   this.employeeForm.reset();
      // });
    }
  }
  deleteEmployee(employeeId: number) {
    if (confirm("Are you sure you want to delete this ?")) {
      // this.userService.deleteStudentById(employeeId).subscribe(() => {
      //   this.dataSaved = true;
      //   this.massage = 'Record Deleted Succefully';
      //   //this.loadAllEmployees();
      //   this.employeeIdUpdate = null;
      //   this.employeeForm.reset();

      // });
    }

  }
}


