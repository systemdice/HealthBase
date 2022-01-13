  

 import { Injectable } from '@angular/core';
 import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
 
 import {  Observable, throwError } from 'rxjs';
 import { catchError } from 'rxjs/operators';
 
 //import { FarmacyDeliveryToPatient } from './FarmacyDeliveryToPatient';
 import { FarmacyDeliveryToPatient } from '../models/UserData';
 import { APIDetails } from '../models/AllConstansts';
 
 @Injectable({
   providedIn: 'root'
 })
export class FarmacyEntryService {

  private apiServer = APIDetails.HelathAPI;//"https://localhost:44380";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  httpOptionsPlain = {
    headers: new HttpHeaders({
      'Accept': 'text/plain',
      'Content-Type': 'text/plain'
    }),
    'responseType': 'text'
  };
  constructor(private httpClient: HttpClient) { }

  create(FarmacyDeliveryToPatient): Observable<FarmacyDeliveryToPatient> {
    return this.httpClient.post<FarmacyDeliveryToPatient>(this.apiServer + '/FarmacyDeliveryToPatient/', JSON.stringify(FarmacyDeliveryToPatient), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  getById(id): Observable<FarmacyDeliveryToPatient> {
    return this.httpClient.get<FarmacyDeliveryToPatient>(this.apiServer + '/FarmacyDeliveryToPatient/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getByCaseId(id:string,storeName:string): Observable<FarmacyDeliveryToPatient> {
    return this.httpClient.get<FarmacyDeliveryToPatient>(this.apiServer + '/FarmacyDeliveryToPatient/getFarmDataCasewise/' + id+'/'+storeName)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getByCaseIdEditFreshCase(id:string): Observable<FarmacyDeliveryToPatient> {
    return this.httpClient.get<FarmacyDeliveryToPatient>(this.apiServer + '/FarmacyDeliveryToPatient/getByCaseIdEditFreshCase/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getLatestGoingtobeID(CashOrCredit,PharmaName):Observable<any>{
    //const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'text/plain' }) };
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<any>(this.apiServer + '/FarmacyDeliveryToPatient/getLatestCashOrCreditID/' + CashOrCredit+'/'+ PharmaName,  httpOptions);
    //return this.httpClient.get<string>(this.apiServer + '/FarmacyDeliveryToPatient/getLatestCashOrCreditID/' + CashOrCredit, httpOptionsPlain);
    
  }

  getAll(): Observable<FarmacyDeliveryToPatient[]> {
    return this.httpClient.get<FarmacyDeliveryToPatient[]>(this.apiServer + '/FarmacyDeliveryToPatient/')
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getFarmDataNamewise(storename:string): Observable<FarmacyDeliveryToPatient[]> {
    return this.httpClient.get<FarmacyDeliveryToPatient[]>(this.apiServer + '/FarmacyDeliveryToPatient/getFarmDataNamewise/'+storename)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getFarmaComision(storename:string): Observable<FarmacyDeliveryToPatient[]> {
    return this.httpClient.get<FarmacyDeliveryToPatient[]>(this.apiServer + '/FarmacyDeliveryToPatient/getFarmaComision/'+storename)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  createStudent(employee: FarmacyDeliveryToPatient): Observable<FarmacyDeliveryToPatient> {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<FarmacyDeliveryToPatient>(this.apiServer + '/FarmacyDeliveryToPatient/',JSON.stringify(employee), httpOptions);
  
  }

  update(id, FarmacyDeliveryToPatient): Observable<FarmacyDeliveryToPatient> {
    return this.httpClient.put<FarmacyDeliveryToPatient>(this.apiServer + '/FarmacyDeliveryToPatient/' + id, JSON.stringify(FarmacyDeliveryToPatient), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
  // }

  delete(id){
    return this.httpClient.delete<FarmacyDeliveryToPatient>(this.apiServer + '/FarmacyDeliveryToPatient/' + id, this.httpOptions)
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
     //console.log(errorMessage);
     return throwError(errorMessage);
  }
}
