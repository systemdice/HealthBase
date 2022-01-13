
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//import { BedManagement } from './BedManagement';
import { BedManagement } from '../models/UserData';
import { APIDetails } from '../models/AllConstansts';

@Injectable({
  providedIn: 'root'
})
export class BedManagementService {

  private apiServer = APIDetails.HelathAPI; //"https://localhost:44380"; //
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  create(BedManagement): Observable<BedManagement> {
    return this.httpClient.post<BedManagement>(this.apiServer + '/BedManagement/', JSON.stringify(BedManagement), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  getById(id): Observable<BedManagement> {
    return this.httpClient.get<BedManagement>(this.apiServer + '/BedManagement/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<BedManagement[]> {
    return this.httpClient.get<BedManagement[]>(this.apiServer + '/BedManagement/')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  createStudent(employee: BedManagement): Observable<BedManagement> {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<BedManagement>(this.apiServer + '/BedManagement/', employee, httpOptions);
  
  }

  update(id, BedManagement): Observable<BedManagement> {
    return this.httpClient.put<BedManagement>(this.apiServer + '/BedManagement/' + id, JSON.stringify(BedManagement), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  updateBedStatus(id, BedCategory,BedName,status,OccupiedBy,OPDIPDID,CaseUniqueID, AssignedDoctor): Observable<BedManagement> {
    return this.httpClient.put<BedManagement>(this.apiServer + '/BedManagement/UpdateBedStatus/' + id+'/' +BedCategory+'/' +BedName+'/' +status +'/'+OccupiedBy+'/' +OPDIPDID+'/' +CaseUniqueID+'/' + AssignedDoctor , this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  UpdateBedStatusDuringAllCaseDelete(id,CaseUniqueID) {
    return this.httpClient.put<BedManagement>(this.apiServer + '/BedManagement/UpdateBedStatusDuringAllCaseDelete/' + id+'/' +CaseUniqueID , this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
  // }

  delete(id){
    return this.httpClient.delete<BedManagement>(this.apiServer + '/BedManagement/' + id, this.httpOptions)
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

