import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FarmacyDeliveryToPatient } from 'src/app/models/UserData';
import { FarmacyEntryService } from 'src/app/Services/farmacy-entry.service';
import { StorageService } from 'src/app/shared/storage.service';

@Component({
  selector: 'app-farmacy-patient-details',
  templateUrl: './farmacy-patient-details.component.html',
  styleUrls: ['./farmacy-patient-details.component.css']
})
export class FarmacyPatientDetailsComponent implements OnInit {
@Input() caseid:string; 
@Input() allFarmaParm:FarmacyDeliveryToPatient;
Username: string;
Role: string;
Location: string;
storename: string;
farmacyDeliveryToPatientData:FarmacyDeliveryToPatient;
  constructor(public farmacyEntryService: FarmacyEntryService,private _store: StorageService) {
    this.Username = this._store.sessionUsername;
    this.Role = this._store.sessionRole;
    this.Location = this._store.sessionLocation;
   }

  ngOnInit(): void {
    //alert(this.caseid);
    // this.loadAllPrameters(this.caseid);  
    this.loadAllPrameters();
  }

  // loadAllPrameters(testName: string) {
  //   this.farmacyEntryService.getByCaseId(this.caseid,this.Username).subscribe((data: FarmacyDeliveryToPatient) => {
  //     this.farmacyDeliveryToPatientData = data;
  //   });
     
      
  //   }

    loadAllPrameters() {
      if(this.allFarmaParm !=undefined){
        this.farmacyDeliveryToPatientData = this.allFarmaParm;
      }
      // this.referralMasterService.getAllStaffType().subscribe((data: ReferralMaster[]) => {
      //   //console.log(data);
      //   this.referralMaster = data;//.filter(x=> x.StaffType == 'Nurse');
      //   this.referralMaster = this.referralMaster.filter(x=> x.StaffType == 'Nurse');
  
      // })
    }
  
    ngOnChanges(changes: SimpleChanges) {
      // only run when property "data" changed
      if (changes['allFarmaParm']) {
        this.farmacyDeliveryToPatientData = this.allFarmaParm;//.filter(x=> x.StaffType == 'Nurse');
      }
  }
  

  headers = ["slno", "Medicine Name", "Unit", "Price", "Time"];

  rows = [
    {
      "ID" : "1",
      "Name" : "Rahul",
      "Age" : "21",
      "Gender" : "Male",
      "Country" : "India"
    },
    {
      "ID" : "2",
      "Name" : "Ajay",
      "Age" : "25",
      "Gender" : "Male",
      "Country" : "India"
    },
    {
      "ID" : "3",
      "Name" : "Vikram",
      "Age" : "31",
      "Gender" : "Male",
      "Country" : "Australia"
    },
    {
      "ID" : "4",
      "Name" : "Riya",
      "Age" : "20",
      "Gender" : "Female",
      "Country" : "India"
    },
    {
      "ID" : "5",
      "Name" : "John",
      "Age" : "23",
      "Gender" : "Male",
      "Country" : "USA"
    },
    {
      "ID" : "6",
      "Name" : "Raman",
      "Age" : "27",
      "Gender" : "Male",
      "Country" : "India"
    },
    {
      "ID" : "7",
      "Name" : "Mohan",
      "Age" : "39",
      "Gender" : "Male",
      "Country" : "India"
    },
    {
      "ID" : "8",
      "Name" : "Shreya",
      "Age" : "21",
      "Gender" : "Female",
      "Country" : "India"
    }
  ]


}
