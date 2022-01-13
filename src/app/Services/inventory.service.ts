 

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//import { InventoryMaster } from './InventoryMaster';
import { InventoryMaster } from '../models/UserData';
import { APIDetails } from '../models/AllConstansts';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

 private apiServer = APIDetails.HelathAPI;//"https://localhost:44380";
 httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/json'
   })
 }
 constructor(private httpClient: HttpClient) { }

 create(InventoryMaster): Observable<InventoryMaster> {
   return this.httpClient.post<InventoryMaster>(this.apiServer + '/InventoryMaster/', JSON.stringify(InventoryMaster), this.httpOptions)
   .pipe(
     catchError(this.errorHandler)
   )
 }  
 getById(id): Observable<InventoryMaster> {
   return this.httpClient.get<InventoryMaster>(this.apiServer + '/InventoryMaster/' + id)
   .pipe(
     catchError(this.errorHandler)
   )
 }

 getAll(): Observable<InventoryMaster[]> {
   return this.httpClient.get<InventoryMaster[]>(this.apiServer + '/InventoryMaster/')
   .pipe(
     catchError(this.errorHandler)
   )
 }

 GetCategoryWise(catagoryType:string,entryowner:string): Observable<InventoryMaster[]> {
  return this.httpClient.get<InventoryMaster[]>(this.apiServer + '/InventoryMaster/GetCategoryWise/'+catagoryType+'/'+entryowner)
  .pipe(
    catchError(this.errorHandler)
  )
}
GetCategoryWiseQuickLook(catagoryType:string,entryowner:string): Observable<InventoryMaster[]> {
  return this.httpClient.get<InventoryMaster[]>(this.apiServer + '/InventoryMaster/GetCategoryWiseQuickLook/'+catagoryType+'/'+entryowner)
  .pipe(
    catchError(this.errorHandler)
  )
}

 createStudent(employee: InventoryMaster): Observable<InventoryMaster> {
   
   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
   return this.httpClient.post<InventoryMaster>(this.apiServer + '/InventoryMaster/', employee, httpOptions);
 
 }

 update(id, InventoryMaster): Observable<InventoryMaster> {
   return this.httpClient.put<InventoryMaster>(this.apiServer + '/InventoryMaster/' + id, JSON.stringify(InventoryMaster), this.httpOptions)
   .pipe(
     catchError(this.errorHandler)
   )
 }

 // updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
 //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
 //   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
 // }

 delete(id){
   return this.httpClient.delete<InventoryMaster>(this.apiServer + '/InventoryMaster/' + id, this.httpOptions)
   .pipe(
     catchError(this.errorHandler)
   )
 }
 errorHandler(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
 }
}

