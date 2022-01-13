import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//import { AppointmentDetail } from './AppointmentDetail';
import { AppointmentDetail, other } from '../models/UserData';
import { APIDetails } from '../models/AllConstansts';
@Injectable({
  providedIn: 'root'
})
export class OtherServicesService {

  private apiServer = "http://api-retrieveassets-exchange-api.us-e2.cloudhub.io/organization/portal/assets";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  

  
  createStudent(employee: other): Observable<other> {
   
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<other>(this.apiServer, employee, httpOptions);
  
  }

  
}
