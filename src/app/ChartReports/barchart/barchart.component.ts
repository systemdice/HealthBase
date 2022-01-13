import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Color, Label } from 'ng2-charts';
import { BarChartData } from './../../shared/BarChartData';
import { APIDetails } from 'src/app/shared/AllConstants';
import { Chart } from 'chart.js';



@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit {

  data: BarChartData[];
  url = APIDetails.HelathAPI + "/Report/getCaseCountPerMonth"; //"https://localhost:44380/Report/getExpPerMonth";//'http://localhost:51888/getExpPerMonth';  
  Months = [];
  Amount = [];
  MonthsIncome = [];
  AmountIncome = [];
  barchart = [];
  constructor(private http: HttpClient) { }

  diff_year_month_day(dt1, dt2) 
 {
 
  // var time =(dt2.getTime() - dt1.getTime()) / 1000;
  // var year  = Math.abs(Math.round((time/(60 * 60 * 24))/365.25));
  // var month = Math.abs(Math.round(time/(60 * 60 * 24 * 7 * 4)));
  // var days = Math.abs(Math.round(time/(3600 * 24)));
  var myVar = "12/12/2018";
  var user_date = Date.parse(myVar);
  var today_date:any = new Date();
  var diff_date =  user_date - today_date;
  
  var num_years = diff_date/31536000000;
  var num_months = (diff_date % 31536000000)/2628000000;
  var num_days = ((diff_date % 31536000000) % 2628000000)/86400000;


          // var diff = Math.floor(date2.getTime() - date1.getTime());
          //     var day = 1000 * 60 * 60 * 24;

          //     var days = Math.floor(diff / day);
          //     var months = Math.floor(days / 31);
          //     var years = Math.floor(months / 12);
  return "Year :- " + num_years + " Month :- " + num_months + " Days :-" + num_days;
   
 }

  ngOnInit() {

    var dt1 = new Date("2019-11-27");
    var dt2 = new Date("2018-06-28");
 
    var diff_year_month_day = this.diff_year_month_day(dt1, dt2)
    //alert(diff_year_month_day);
    

    this.http.get(this.url).subscribe((result: BarChartData[]) => {
      result.forEach(x => {
        this.Months.push(x.Month);
        this.Amount.push(x.Amount);
      });
      
      // this.barchart = new Chart('canvasExpense', {
      //   type: 'bar',
      //   data: {
      //     labels: this.Months,
      //     datasets: [
      //       {
      //         data: this.Amount,
      //         borderColor: '#3cba9f',
      //         backgroundColor: [
      //           "#3cb371",
      //           "#0000FF",
      //           "#9966FF",
      //           "#4C4CFF",
      //           "#00FFFF",
      //           "#f990a7",
      //           "#aad2ed",
      //           "#FF00FF",
      //           "Blue",
      //           "Red",
      //           "Blue"
      //         ],
      //         fill: true
      //       }
      //     ]
      //   },
      //   options: {
      //     legend: {
      //       display: false
      //     },
      //     scales: {
      //       xAxes: [{
      //         display: true
      //       }],
      //       yAxes: [{
      //         display: true
      //       }],
      //     }
      //   }
      // });

      // this.barchart = new Chart('canvasExpenseProgress', {
      //   type: 'line',
      //   data: {
      //     labels: this.Months,
      //     datasets: [
      //       {
      //         data: this.Amount,
      //         borderColor: '#3cba9f',
      //         backgroundColor: [
      //           "#aad2ed"
      //         ],
      //         fill: true
      //       }
      //     ]
      //   },
      //   options: {
      //     legend: {
      //       display: false
      //     },
      //     scales: {
      //       xAxes: [{
      //         display: true
      //       }],
      //       yAxes: [{
      //         display: true
      //       }],
      //     }
      //   }
      // });

    });

    this.http.get(this.url).subscribe((result: BarChartData[]) => {
      result.forEach(x => {
        this.MonthsIncome.push(x.Month);
        this.AmountIncome.push(x.Amount);
      });

    //   this.barchart = new Chart('canvasIncome', {
    //     type: 'bar',
    //     data: {
    //       labels: this.MonthsIncome,
    //       datasets: [
    //         {
    //           data: this.AmountIncome,
    //           borderColor: '#3cba9f',
    //           backgroundColor: [
    //             "#3cb371",
    //             "#0000FF",
    //             "#9966FF",
    //             "#4C4CFF",
    //             "#00FFFF",
    //             "#f990a7",
    //             "#aad2ed",
    //             "#FF00FF",
    //             "Blue",
    //             "Red",
    //             "Blue"
    //           ],
    //           fill: true
    //         }
    //       ]
    //     },
    //     options: {
    //       legend: {
    //         display: false
    //       },
    //       scales: {
    //         xAxes: [{
    //           display: true
    //         }],
    //         yAxes: [{
    //           display: true
    //         }],
    //       }
    //     }
    //   });

    //   this.barchart = new Chart('canvasIncomeProgress', {
    //     type: 'line',
    //     data: {
    //       labels: this.MonthsIncome,
    //       datasets: [
    //         {
    //           data: this.AmountIncome,
    //           borderColor: '#3cba9f',
    //           backgroundColor: [
    //             "#3cb371"
    //           ],
    //           fill: true
    //         }
    //       ]
    //     },
    //     options: {
    //       legend: {
    //         display: false
    //       },
    //       scales: {
    //         xAxes: [{
    //           display: true
    //         }],
    //         yAxes: [{
    //           display: true
    //         }],
    //       }
    //     }
    //   });


     });
  }

  //////////////EXpense//////////////////////
  public barChartOptionsE: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabelsE: Label[] = this.Months;// ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartTypeE: ChartType = 'bar';
  public barChartTypeEP: ChartType = 'line';
  public barChartLegendE = false;
  public barChartPluginsE = [pluginDataLabels];

  public barChartDataE: ChartDataSets[] = [
    { data: this.Amount, label: 'Expense' },
    //{ data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    
  ];
  public lineChartColorsE: Color[] = [
    {
      borderColor: 'black',
      backgroundColor:  [
                  "#3cb371",
                  "#0000FF",
                  "#9966FF",
                  "#4C4CFF",
                  "#00FFFF",
                  "#f990a7",
                  "#aad2ed",
                  "#FF00FF",
                  "Blue",
                  "Red",
                  "Blue"
                ]
    },
  ];
  ////////////////////////////Ended///////////
  ///////////////////////////Income/////////////////
  public barChartOptionsI: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabelsI: Label[] = this.MonthsIncome;// ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartTypeI: ChartType = 'bar';
  public barChartTypeIP: ChartType = 'line';
  public barChartLegendI = false;
  public barChartPluginsI = [pluginDataLabels];

  public barChartDataI: ChartDataSets[] = [
    { data: this.AmountIncome, label: 'Income' },
    //{ data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    
  ];
  public lineChartColorsI: Color[] = [
    {
      borderColor: 'black',
      backgroundColor:  [
                 
                  "#00FFFF",
                  "#f990a7",
                  "#aad2ed",  
                  "#3cb371",
                  "#0000FF",
                  "#9966FF",
                  "#4C4CFF",                  
                  "#FF00FF",
                  "Blue",
                  "Red",
                  "Blue"
                ]
    },
  ];
  ////////////////////////////
  //////////////////ended//////////////////


  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Expense' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Income' }
  ];

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    //console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    //console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
  }

}
