import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AllMasterFixedData } from '../shared/AllConstants';

@Component({
  selector: 'app-patient-discharge-note',
  templateUrl: './patient-discharge-note.component.html',
  styleUrls: ['./patient-discharge-note.component.css']
})
export class PatientDischargeNoteComponent implements OnInit {
  @Input() DischargeNote : FormGroup;
  animal: string;
  name: string;
  hlData:string;
  DischargeTypes:string[] = AllMasterFixedData.DischargeType
  //Addressline1= AllMasterFixedData.DischargeType;
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

 
}


