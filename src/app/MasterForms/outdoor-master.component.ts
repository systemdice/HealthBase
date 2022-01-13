import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-outdoor-master',
  templateUrl: './outdoor-master.component.html',
  styleUrls: ['./outdoor-master.component.css']
})
export class OutdoorMasterComponent implements OnInit {
  @Input() OPD : FormGroup;
  checkBoxValueList = [
    'PathLAB test',
    'Blood Pressure',
    'Sugar Level',
    'Diet Control'
  ];
  get OPDChoiceFormArray() {
    return this.OPD.get('OPDChoice') as FormArray;
  }
  constructor(private fb: FormBuilder) { 
    
  }

  teachers(): FormArray {
    return this.OPD.get("OPDChoice") as FormArray
  }
 
  newTeacher(name,val): FormGroup {
    return this.fb.group({
      name: [name],
      val:[val]
    })
  }

  addTeacher() {

    const FormControlObject = {};
    this.checkBoxValueList.forEach(res => {
      //FormControlObject[res] = new FormControl(false);
      //this.teachers().push(new FormControl(res));
      this.teachers().push(this.newTeacher(res,false))
    });
   
  }

 

  private addCheckboxes() {
    this.checkBoxValueList.forEach(() => 
    this.teachers().push(this.newTeacher('',''))
    )
   
  }

  ngOnInit(): void {
    this.addTeacher();
  }

  onCheckBoxChanges(ind:number,values:any) {
    // get current position of the changes element by ID
    //alert(values.currentTarget.checked);
    if(values.currentTarget.checked == true)
    {
      this.teachers().value[ind].val=true;
    }
    else
    {
      this.teachers().value[ind].val=false;
    }
    
   
  }

}
