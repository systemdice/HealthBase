  

 import { Injectable } from '@angular/core';
 import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
 
 import {  Observable, throwError } from 'rxjs';
 import { catchError } from 'rxjs/operators';
 
 //import { AddQuestion } from './AddQuestion';
 import { AddQuestion } from '../models/UserData';
 import { APIDetails } from '../models/AllConstansts';
 
 @Injectable({
   providedIn: 'root'
 })
export class AddQuestionService {

  private apiServer = APIDetails.HelathAPI;//"https://localhost:44380";//APIDetails.HelathAPI;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  create(AddQuestion): Observable<AddQuestion> {
    return this.httpClient.post<AddQuestion>(this.apiServer + '/AddQuestion/', JSON.stringify(AddQuestion), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  getById(id): Observable<AddQuestion> {
    return this.httpClient.get<AddQuestion>(this.apiServer + '/AddQuestion/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<AddQuestion[]> {
    return this.httpClient.get<AddQuestion[]>(this.apiServer + '/AddQuestion/')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  createStudent(employee: AddQuestion): Observable<AddQuestion> {
   
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<AddQuestion>(this.apiServer + '/AddQuestion/', employee, httpOptions);
  
  }

  update(id, AddQuestion): Observable<AddQuestion> {
    return this.httpClient.put<AddQuestion>(this.apiServer + '/AddQuestion/' + id, JSON.stringify(AddQuestion), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
  // }

  delete(id){
    return this.httpClient.delete<AddQuestion>(this.apiServer + '/AddQuestion/' + id, this.httpOptions)
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
