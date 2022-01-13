import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { User } from './User';
import { MatSidenav } from '@angular/material';
import { HttpClient } from '@angular/common/http';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'LAB System';
  currentUser: User;
  userName:boolean =false;
  Component2Data: any = ''; 
  //imageString: string = "assets//jhia.png"
  @ViewChild('sidenav', {static:true}) sidenav: MatSidenav;
  isExpanded = false;
  showSubmenu: boolean = false;
  showSubmenu1: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;

  makeHttpCall() {
    this.http.get('https://jsonplaceholder.typicode.com/comments')
      .subscribe((r) => {
       // console.log(r);
      });
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
 
  key:string = 'Item 1';
  constructor (private authService:AuthService, 
               private router:Router,public http: HttpClient) {
                this.authService.SharingData.subscribe((res: any) => {  
                  this.Component2Data = res; 

                  if(localStorage.getItem(this.key) == null || localStorage.getItem(this.key) == undefined)
                  localStorage.setItem(this.key, res); 
               
                }) 

     //this.userName = this.authService.isUserLoggedIn().toString(); 
     //alert(this.authService.isUserLoggedIn())  ;   

  }
tt:any;
  ngOnInit() {

    
     let  dt2 = new Date('12/31/2020');
     let  dt1 = new Date(); //new Date('11/04/2014');
      //return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
      
      // console.log(date_diff_indays('04/02/2014', '11/04/2014'));
      // console.log(date_diff_indays('12/02/2014', '11/04/2014'));
    var date1 = new Date("12/30/2020"); 
    var  date2= new Date(); 
      
    // To calculate the time difference of two dates 
    //var Difference_In_Time =  date2.getDay()-date1getDay(); 
      
    // To calculate the no. of days between two dates 
    //var Difference_In_Days = Difference_In_Time;// / (1000 * 3600 * 24); 

    this.tt = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24)); //Difference_In_Days;//new Date().getTime() - new Date("2020-12-12T12:01:04.753Z").getDay();

    //this.authService.SharingData.next("sysdice");
    //this.authService.SharingData.next("sysdice");
    // this.authService.SharingData.subscribe((res: any) => {  
    //   this.Component2Data = res;  
    // })

    if(localStorage.getItem(this.key) == null || localStorage.getItem(this.key) == undefined)
    {
                  //localStorage.setItem(this.key, res); 
    }
                  else{

    let myItem = localStorage.getItem(this.key);
    this.Component2Data=myItem
                  }
    
    //this.Component2Data = this.authService.isUserLoggedIn().toString();  
}
 
  logout() {
    this.authService.SharingData.next(null);
    this.authService.logoutUser();
    this.router.navigate(['login']);
  }
 
}