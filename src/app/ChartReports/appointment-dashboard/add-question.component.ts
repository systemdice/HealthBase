import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms'
import { AddQuestion } from 'src/app/models/UserData';
import { AddQuestionService } from 'src/app/Services/add-question.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit{
 
  title = 'FormArray SetValue & PatchValue Example';
 
  subjectsForm: FormGroup;
  PaperCategory: any[] = ['Physics','Chemistry' ,'Mathematics', 'Science', 'ComputerScience'];
  ClassCategory:any[] =  ['One','Two' ,'Three', 'Four', 'Eight','Nine','Ten',"+2",'+3','PG','Higher','Competitative','Others','IAS'];
  DificultyLevel:any[] = ['Easy','Intermediate','Difficult','Tricky','High level']
  constructor(private fb: FormBuilder,public addQuestionService: AddQuestionService) {
    this.subjectsForm = this.fb.group({
      subjects: this.fb.array([]),
    })
  }
  /** Teachers */
  subjects(): FormArray {
    return this.subjectsForm.get("subjects") as FormArray
  }
 
  newSubject(si:number): FormGroup {
    return this.fb.group({
      name: [],
      id:[si+1],
      description:[],
      paperCategory:['',Validators.required],  
      classCategory:['',Validators.required],
      dificultyLevel:['',Validators.required],         
      questions: this.fb.array([]) //batches
    })
  }
 
 
  addSubject() {
    this.subjects().push(this.newSubject(0));
  }
 
 
  removeSubject(ti) {
    this.subjects().removeAt(ti);
  }
 
 /** batches */
 
 questions(ti): FormArray {
  return this.subjects().at(ti).get("questions") as FormArray
}


newQuestion(qi:number): FormGroup {
  return this.fb.group({
    name: [],
    id:[qi+1],
    questionTypeId:[1],
    options: this.fb.array([]),
    questionType: this.fb.group({  "id": 1,"name": "Multiple Choice", "isActive": true}), 
  })
}

addQuestion(ti: number) {
  this.questions(ti).push(this.newQuestion(this.questions(ti).length));
}

removeQuestion(ti: number, bi: number) {
  this.questions(ti).removeAt(ti);
}

/** students */
 
options(ti, bi): FormArray {
  return this.questions(ti).at(bi).get("options") as FormArray
}

newOption(ti:any,kk:string,jj:boolean): FormGroup {
  return this.fb.group({
    name: [kk],
      id: [ti],
      questionId: [1010],
      isAnswer: [jj]
  })
}
newOptionFresh(ti:any): FormGroup {
  return this.fb.group({
    name: [],
      id: [ti+1],
      questionId: [1010],
      isAnswer: [false]
  })
}

addOption(ti: number, bi: number) {
  this.options(ti, bi).push(this.newOptionFresh(this.options(ti, bi).length));
}

removeOption(ti: number, bi: number, si: number) {
  this.options(ti, bi).removeAt(si);
}
 
 
  onSubmit() {
    //console.log(JSON.stringify(this.subjectsForm.value.subjects[0]));
    this.CreateStudent(this.subjectsForm.value.subjects[0]);
  }
  employeeIdUpdate:string;
  CreateStudent(student: AddQuestion) {
    this.employeeIdUpdate =null;// "456";
    if (this.employeeIdUpdate == null) {
     
      
      this.addQuestionService.createStudent(student).subscribe(
        (data) => {
          let k:any= data;
          //this.dataSaved = true;
          //this.massage = 'Record saved Successfully';
          alert('Question paper('+data.UnqueID+') created Successfully. Paper ID is: '+data.UnqueID);
          //this.loadAllEmployees();
          this.employeeIdUpdate = null;
          this.subjectsForm.reset();
         // this.dialogRef.close({event:this.action,data:this.local_data});
        });
    } else {
      //employee.EmpId = this.row.id;
      //student.UnqueID = this.data.row.UnqueID;
      var id= this.employeeIdUpdate;
      //var p = student.UnqueID;
      this.addQuestionService.update(id,student).subscribe(() => {
        // this.dataSaved = true;
        // this.massage = 'Record Updated Successfully';
        //this.loadAllEmployees();
        alert('Unit data updated Successfully.');
        this.employeeIdUpdate = null;
        this.subjectsForm.reset();
        //this.dialogRef.close({event:this.action,data:this.local_data});
      });
    }
  }

  ngOnInit() {
    //this.addTeacher();

    this.LoadAllTestInvestigations(); 
    setTimeout(() => {

              }, 1000)
   
  }
  addQuestions:AddQuestion[] = [];
  LoadAllTestInvestigations(){
    this.addQuestionService.getAll().subscribe((data: AddQuestion[])=>{
      //console.log(data);
      this.addQuestions.push(data[1]);// = data;
      
    
    }) 
  }

  patchValue2() {
 
    var data =  this.addQuestions;
    this.clearFormArray();
   
   
    data.forEach(t => {
     // var batch1 = this.newSubject();
      var teacher: FormGroup = this.newSubject(t.id);
      
      this.subjects().push(teacher);
      this.subjects().patchValue([
        { name: t.name, description: t.description}
      ]);
      //this.subjectsForm.get('name').patchValue(t.name);// = t.name;
      //this.subjects().patchValue(t);// = t.name;
      t.questions.forEach(b => {
        var batch = this.newQuestion(b.id);
   
        (teacher.get("questions") as FormArray).push(batch);
        (teacher.get("questions") as FormArray).patchValue([
          { name: b.name}
        ]);
   
        b.options.forEach(s => {
          var k=true;
          if(s.isAnswer == null ||s.isAnswer==false ) k=false;
          (batch.get("options") as FormArray).push(this.newOption(s.id,s.name,k));
          // var k=true;
          // if(s.isAnswer == null) k=false;
          // (batch.get("options") as FormArray).patchValue((batch.get("options") as FormArray).value);
          //this.subjectsForm.get('questions').get('options').patchValue(s);
        })
        //this.options.patchValue(data);
   
      });
    });
   
    //this.subjectsForm.get('questions').get('options').patchValue(data);
  }
   
   
  clearFormArray() {
   
    //Angular 8 +
    this.subjects().clear();
   
    //older Versions of angualar
    //while (this.teachers().length) {
    //  this.teachers().removeAt(0);
    //}
  }
  doAction(){

  }
 
}
 