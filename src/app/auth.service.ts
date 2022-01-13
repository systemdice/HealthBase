import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { of, Subject } from 'rxjs';
import { StorageService } from './shared/storage.service';
 
@Injectable({
    providedIn: 'root'
  })
export class AuthService { 
 
    private isloggedIn: boolean;
    private userName:string;
    SharingData = new Subject();
    userNameS = new Subject<any>();
    Username: string;
    Role: string;
    Location: string;
    
    constructor( private _store: StorageService) {
        this.isloggedIn=false;
        this.Username = this._store.sessionUsername;
    this.Role = this._store.sessionRole;
    }
 
    login(username: string, password:string) {
 
        //Assuming users are provided the correct credentials.
        //In real app you will query the database to verify.
        this.isloggedIn=true;
        this.userName=username;
        return of(this.isloggedIn);
    }
 
    isUserLoggedIn(): boolean {
        return (this._store.sessionUsername !== undefined )?true:false; //this.isloggedIn;
    }
 
    isAdminUser():boolean {
        if (this._store.sessionUsername=='Admin') {
            return true; 
        }
        return false;
    }
    
    logoutUser(): void{
        this.isloggedIn = false;
        this.SharingData.next(null);
    }
 
}