import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { AppointmentDetail, other, ReferralMaster } from 'src/app/models/UserData';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { DateAdapter } from '@angular/material/core';

import { Observable, Subject, ReplaySubject, from, of, range } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
//import Rx from 'rxjs/Rx';
import * as _ from 'lodash';
import { AppointmentDetailService } from 'src/app/Services/appointment-detail.service';
import { OtherServicesService } from 'src/app/Services/other-services.service';
import { RefaralService } from 'src/app/Services/referal.service';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-health-dashboard',
  templateUrl: './health-dashboard.component.html',
  styleUrls: ['./health-dashboard.component.css']
})
export class HealthDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
