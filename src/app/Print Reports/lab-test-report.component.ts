import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lab-test-report',
  templateUrl: './lab-test-report.component.html',
  styleUrls: ['./lab-test-report.component.css']
})
export class LabTestReportComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigate() {
    this.router.navigate( ['LabReportandFindings'], { queryParams: { jwt: '123'}});
  }

}
