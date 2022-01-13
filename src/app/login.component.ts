import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as uuid from "uuid";
import { FormGroup, FormControl, NgForm } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { StorageService } from "./shared/storage.service";
import { UserDetailsService } from "./Services/user-details.service";
import { UserDetails } from "./models/UserData";
import { Observable } from "rx";
import { APIDetails } from "./models/AllConstansts";
import { AllMasterFixedData } from "./shared/AllConstants";

export interface IUser {
    UserId: string;
    UserName: string;
    Pasword:string;
    Location: string;
    Role:string;
  }


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login_user_msg: string;
  has_error = false;
  hide = true;
  ProductType:string = AllMasterFixedData.ProductLicence[0];
  test="patho";
  users: UserDetails[];
  Username: string =  "Dummy"
  error:any;
  CompID:string='CO0X2001';
  form: FormGroup = new FormGroup({
    username: new FormControl(""),
    password: new FormControl("")
  });
  constructor(private _router: Router, private _store: StorageService,private http: HttpClient,
    private userDetailsService:UserDetailsService) {}
    country:string;
    ngOnInit() {
      //this.getIPAddress(); to get callers IP Address
    sessionStorage[this.Username] = "sysdice";
    //this.LoadAllUser();
    this.users=[];
    // this.getString('liku')
    // .subscribe(
    //   data => {
    //     this.country = data
    //   alert(this.country);}
    // );
    
  }
  ipAddress = '';
  getIPAddress()
  {
    this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
      this.ipAddress = res.ip;
    });
  }
  getString(email: string){
    //private apiServer = APIDetails.HelathAPI; //"https://localhost:44380"; //
// responseType: text' works when there is no generic code applied to it.
// it will work for: http.get(url, {responseType: text'}
// But, does not work for: http.get<U>(url, {responseType: text'}
    return this.http.get(APIDetails.HelathAPI+'/NewModifyCase/getstring/liku',  {responseType:'text'});
   
  }
  LoadAllUser(){
    this.userDetailsService.getAll().subscribe((data: UserDetails[]) => {
      //console.log(data);
      this.users = data;
      this.has_error = false;
        this.login_user_msg = 'Login in, Please wait... !!!';
        
    });
  }
  submit() {

    
    
    if (this.form.valid) {

      this.userDetailsService.GetLoginDetails(this.form.value.username,this.form.value.password).subscribe((data: UserDetails[]) => {
        //console.log(data);
        this.users = data;
        this.has_error = false;
          this.login_user_msg = 'Login in, Please wait... !!!';
          let findUser = this.users.find(x=> x.UserName== this.form.value.username && x.Password==this.form.value.password);
      if(findUser!= null)
      {
      this._store.sessionId = guid;
      this._store.sessionUsername = this.form.value.username;
      this._store.sessionRole = findUser.Role;
      this._store.sessionProductType = this.ProductType;
      if(findUser.Role == 'Doctor'){
        this._store.sessionUsername = findUser.RefferDoctorName;
      }
      this._store.sessionLocation = findUser.Location;//'sytemdice';//findUser.Location; need to add Location field in API on later stage. now it is hard coded
     // this._router.navigate(["/home"]);
     if(findUser.Role == 'Admin'){
      this._router.navigate(['/maindashboard']);
     }
     else{
      this._router.navigate(['/home', 37], { queryParams: { username: "ax3r5!mmmt!4rtresjjgnth"}});
     }
      
      }
      else{
        this.login_user_msg = 'Login Unsuccessful!!! Please try again.';
          alert('Login Unsuccessful!!! Please try again.')
      }
          
      });


      const guid = uuid.v4();
      
    }
  }

  
  
}
