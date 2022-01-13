
import { StorageService } from 'src/app/shared/storage.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger, MatSidenav } from '@angular/material';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-master-layout',
  templateUrl: './master-layout.component.html',
  styleUrls: ['./master-layout.component.css']
})
export class MasterLayoutComponent implements OnInit {
  Username: string;
  Role: string;
  Location: string;
  title = 'Medical System';
  //sidenav:any;


  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  isExpanded = false;
  showSubmenu: boolean = false;
  showSubmenu1: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  constructor(private _router: Router, private _store: StorageService,
    private router: Router, public http: HttpClient) {
    this.Username = this._store.sessionUsername;
    this.Role = this._store.sessionRole;
    this.Location = this._store.sessionLocation;
  }
  addEditExpenseItem(expenseId, firstName: string) {
    this._router.navigate(['/freshCase', 'Addnew'], { queryParams: { username: "" } });
  }
  logout() {
    this.Username = '';
    this._store.deleteSession();
    this._router.navigate([""]);
  }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
  tt: any;
  showMenu: boolean = true;
  FarmaRole: boolean = true;

  menuNo1 = false;
  menuNo2 = false;
  menuNo3 = false;
  menuNo4 = false;
  menuNo5 = false;
  menuNo6 = false;
  menuNo7 = false;
  menuNo8 = false;
  menuNo9 = false;
  menuNo10 = false;

  menuheaderAppointment = false;
  menuheaderDashboard = false;
  menuheaderNewcase = false;
  menuheaderAllCase = false;

  data: any[] = [];
  ngOnInit() {

    for (let i = 1; i <= 1; i++) {
      const item = { id: i, name: `Person ${i}`, email: `person${i}@gmail.com` };

      this.data.push(item);
    }

    if (this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Account') {
      //this.FarmaRole=false;
      this.menuNo1 = true;
      this.menuNo2 = true;
      this.menuNo3 = true;
      this.menuNo4 = true;
      this.menuNo5 = true;
      this.menuNo6 = true;
      this.menuNo7 = true;
      this.menuNo8 = false;
      this.menuNo9 = false;
      this.menuNo10 = false;
      this.menuheaderAppointment = true;
      this.menuheaderDashboard = true;
      this.menuheaderNewcase = true;
      this.menuheaderAllCase = true;
    }
    else if (this.Role == 'Pharmacy') {
      this.menuNo1 = false;
      this.menuNo2 = false;
      this.menuNo3 = false;
      this.menuNo4 = false;
      this.menuNo5 = false;
      this.menuNo6 = false;
      this.menuNo7 = false;
      this.menuNo8 = true;
      this.menuNo9 = false;
      this.menuNo10 = false;
      this.menuheaderAppointment = false;
      this.menuheaderDashboard = false;
      this.menuheaderNewcase = false;
      this.menuheaderAllCase = false;
    }
    else if (this.Role == 'Doctor') {
      this.menuNo1 = false;
      this.menuNo2 = false;
      this.menuNo3 = false;
      this.menuNo4 = false;
      this.menuNo5 = false;
      this.menuNo6 = false;
      this.menuNo7 = true;
      this.menuNo8 = false;
      this.menuNo9 = true;
      this.menuNo10 = false;
      this.menuheaderAppointment = false;
      this.menuheaderDashboard = false;
      this.menuheaderNewcase = false;
      this.menuheaderAllCase = true;
    }
    else if (this.Role == 'Patho') {
      this.menuNo1 = false;
      this.menuNo2 = false;
      this.menuNo3 = false;
      this.menuNo4 = false;
      this.menuNo5 = false;
      this.menuNo6 = false;
      this.menuNo7 = false;
      this.menuNo8 = false;
      this.menuNo9 = false;
      this.menuNo10 = true;
      this.menuheaderAppointment = false;
      this.menuheaderDashboard = false;
      this.menuheaderNewcase = false;
      this.menuheaderAllCase = true;
    }
    else if (this.Role == 'Reception' || this.Role == 'Supervisor') {
      this.menuNo1 = false;
      this.menuNo2 = true;
      this.menuNo3 = true;
      this.menuNo4 = false;
      this.menuNo5 = false;
      this.menuNo6 = false;
      this.menuNo7 = true;
      this.menuNo8 = false;
      this.menuNo9 = false;
      this.menuNo10 = false;
      this.menuheaderAppointment = true;
      this.menuheaderDashboard = false;
      this.menuheaderNewcase = true;
      this.menuheaderAllCase = true;
    }
    else {
      this.showMenu = true;
      this.FarmaRole = false;
    }


    let dt2 = new Date('10/30/2021');
    let dt1 = new Date(); 
   
    this.tt = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24)); 
    if(this._store.sessionProductType == 'Patho LAB'){
      this.PathoLABMenus();
          }

          if(this._store.sessionProductType == 'Patho LAB and Pharmacy'){
            this.PathoLABMenus();
            this.PharmacyandPathoMenus();
                } 

                if(this._store.sessionProductType == 'Pharmacy'){
                  this.OnlyPathoLAB();
                
                      }

  }
  onOpenMenu(menu: any): void {
    console.log(menu);
  }

  PharmacyandPathoMenus(){
    this.menuNo1 = false;
    this.menuNo2 = true; // Health Module
    this.menuNo3 = true; //Account Section
    this.menuNo4 = true; //user management
    this.menuNo5 = false;
    this.menuNo6 = false;
    this.menuNo7 = false;
    this.menuNo8 = true;
    this.menuNo9 = false;
    this.menuNo10 = false;
    this.menuheaderAppointment = false;
    this.menuheaderDashboard = true;
    this.menuheaderNewcase = true;
    this.menuheaderAllCase = true;
  }

  PathoLABMenus(){
    this.menuNo1 = false;
      this.menuNo2 = true; // Health Module
      this.menuNo3 = true; //Account Section
      this.menuNo4 = true; //user management
      this.menuNo5 = false;
      this.menuNo6 = false;
      this.menuNo7 = false;
      this.menuNo8 = false;
      this.menuNo9 = false;
      this.menuNo10 = false;
      this.menuheaderAppointment = false;
      this.menuheaderDashboard = true;
      this.menuheaderNewcase = true;
      this.menuheaderAllCase = true;
  }

  OnlyPathoLAB(){
    this.menuNo1 = false;
      this.menuNo2 = false;
      this.menuNo3 = false;
      this.menuNo4 = false;
      this.menuNo5 = false;
      this.menuNo6 = false;
      this.menuNo7 = false;
      this.menuNo8 = true;
      this.menuNo9 = false;
      this.menuNo10 = false;
      this.menuheaderAppointment = false;
      this.menuheaderDashboard = false;
      this.menuheaderNewcase = false;
      this.menuheaderAllCase = false;
  }
  @ViewChild('languageMenuTrigger') languageMenuTrigger: MatMenuTrigger;
  


  openMenu() {
    this.languageMenuTrigger.openMenu();
  }
  
  closeMenu() {
    this.languageMenuTrigger.closeMenu();
  }
}
