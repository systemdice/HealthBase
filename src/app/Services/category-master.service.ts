import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//import { CategoryMaster } from './CategoryMaster';
import { CategoryMaster } from '../models/UserData';
import { APIDetails } from '../models/AllConstansts';

@Injectable({
  providedIn: 'root'
})
export class CategoryMasterService {

  private apiServer = APIDetails.HelathAPI; //"https://localhost:44380";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  create(CategoryMaster): Observable<CategoryMaster> {
    return this.httpClient.post<CategoryMaster>(this.apiServer + '/CategoryMaster/', JSON.stringify(CategoryMaster), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  getById(id): Observable<CategoryMaster> {
    return this.httpClient.get<CategoryMaster>(this.apiServer + '/CategoryMaster/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<CategoryMaster[]> {
    return this.httpClient.get<CategoryMaster[]>(this.apiServer + '/CategoryMaster/')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  createStudent(employee: CategoryMaster): Observable<CategoryMaster> {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<CategoryMaster>(this.apiServer + '/CategoryMaster/', employee, httpOptions);
  
  }

  update(id, CategoryMaster): Observable<CategoryMaster> {
    return this.httpClient.put<CategoryMaster>(this.apiServer + '/CategoryMaster/' + id, JSON.stringify(CategoryMaster), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
  // }

  delete(id){
    return this.httpClient.delete<CategoryMaster>(this.apiServer + '/CategoryMaster/' + id, this.httpOptions)
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
