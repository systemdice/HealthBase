
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//import { NewModifyCase } from './NewModifyCase';
import { BedReport, NewModifyCase, NotifyPendingTestData, OPDIPDModel, ProfitLost } from '../models/UserData';
import { APIDetails } from '../models/AllConstansts';
@Injectable({
  providedIn: 'root'
})
export class AddModifyCaseService {

  private apiServer =  APIDetails.HelathAPI;//"https://localhost:44380";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  create(NewModifyCase:NewModifyCase): Observable<NewModifyCase> {
    return this.httpClient.post<NewModifyCase>(this.apiServer + '/NewModifyCase/', JSON.stringify(NewModifyCase), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  getById(id:string): Observable<NewModifyCase> {
    return this.httpClient.get<NewModifyCase>(this.apiServer + '/NewModifyCase/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getDataWithUniqueorIPOP(UnqueIDIPOP:string): Observable<NewModifyCase> {
    return this.httpClient.get<NewModifyCase>(this.apiServer + '/NewModifyCase/getDataWithUniqueorIPOP/' + UnqueIDIPOP)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getByDateStart(DateStart): Observable<NewModifyCase[]> {
    return this.httpClient.get<NewModifyCase[]>(this.apiServer + '/NewModifyCase/GetByDateStart/' + DateStart)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<NewModifyCase[]> {
    return this.httpClient.get<NewModifyCase[]>(this.apiServer + '/NewModifyCase/')
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getFarmaCreditDetails(PharmaName:string): Observable<NewModifyCase[]> {
    return this.httpClient.get<NewModifyCase[]>(this.apiServer + '/NewModifyCase/getFarmaCreditDetails/'+PharmaName)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getAllTodaysCase(): Observable<NewModifyCase[]> {
    return this.httpClient.get<NewModifyCase[]>(this.apiServer + '/NewModifyCase/getAllTodaysCase')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAnydaysCase(dateVal:string): Observable<NewModifyCase[]> {
    return this.httpClient.get<NewModifyCase[]>(this.apiServer + '/NewModifyCase/getAnydaysCase/'+dateVal)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getDateRangeCase(dateFrom:string, dateTo:string,): Observable<NewModifyCase[]> {
    return this.httpClient.get<NewModifyCase[]>(this.apiServer + '/NewModifyCase/getDateRangeCase/'+dateFrom+'/'+dateTo)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getDateRangeBalanceSheet(dateFrom:string, dateTo:string,): Observable<NewModifyCase[]> {
    return this.httpClient.get<NewModifyCase[]>(this.apiServer + '/NewModifyCase/getDateRangeBalanceSheet/'+dateFrom+'/'+dateTo)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getLastNDaysCase(noofdays): Observable<NewModifyCase[]> {
    return this.httpClient.get<NewModifyCase[]>(this.apiServer + '/NewModifyCase/getLastNDaysCase/'+noofdays)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getTypeData(par:string): Observable<NewModifyCase[]> {
    return this.httpClient.get<NewModifyCase[]>(this.apiServer + '/NewModifyCase/getTypeData/'+par)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getAdmitted(): Observable<BedReport[]> {
    return this.httpClient.get<BedReport[]>(this.apiServer + '/NewModifyCase/getAdmitted')
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getAllPendingTests(): Observable<NotifyPendingTestData[]> {
    return this.httpClient.get<NotifyPendingTestData[]>(this.apiServer + '/NewModifyCase/getPendingTest')
    .pipe(
      catchError(this.errorHandler)
    )
  }
  

  getUniqueIdFromIPOP(opipid:string): Observable<NewModifyCase> {
    return this.httpClient.get<NewModifyCase>(this.apiServer + '/NewModifyCase/getUniqueIdFromIPOP/' + opipid)
    .pipe(
      catchError(this.errorHandler)
    )
  }


  getPendingFarmaJob(): Observable<NotifyPendingTestData[]> {
    return this.httpClient.get<NotifyPendingTestData[]>(this.apiServer + '/NewModifyCase/getPendingFarmaJob')
    .pipe(
      catchError(this.errorHandler)
    )
  }


  getOPDIPDVSCount(): Observable<ProfitLost[]> {
    return this.httpClient.get<ProfitLost[]>(this.apiServer + '/NewModifyCase/getOPDIPDVSCount')
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getOPDIPDPerMonth(): Observable<OPDIPDModel[]> {
    return this.httpClient.get<OPDIPDModel[]>(this.apiServer + '/NewModifyCase/getOPDIPDPerMonth')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getCasewithDoctorAll(): Observable<OPDIPDModel[]> {
    return this.httpClient.get<OPDIPDModel[]>(this.apiServer + '/NewModifyCase/getCasewithDoctorAll')
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getCasewithDoctorPerMonth(): Observable<OPDIPDModel[]> {
    return this.httpClient.get<OPDIPDModel[]>(this.apiServer + '/NewModifyCase/getCasewithDoctorPerMonth')
    .pipe(
      catchError(this.errorHandler)
    )
  }


  createStudent(employee: NewModifyCase): Observable<NewModifyCase> {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<NewModifyCase>(this.apiServer + '/NewModifyCase/',JSON.stringify(employee), httpOptions);
  
  }

  update(id, NewModifyCase): Observable<NewModifyCase> {
    return this.httpClient.put<NewModifyCase>(this.apiServer + '/NewModifyCase/' + id, JSON.stringify(NewModifyCase), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
  // }

  delete(id,SoftDelete:string){
    return this.httpClient.delete<NewModifyCase>(this.apiServer + '/NewModifyCase/' + id +'/'+SoftDelete, this.httpOptions)
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

