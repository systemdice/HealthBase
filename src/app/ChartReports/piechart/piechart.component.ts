import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PieChartData } from './../../shared/PieChartData';
import {Chart } from 'chart.js';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { APIDetails } from 'src/app/shared/AllConstants';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css']
})
export class PiechartComponent implements OnInit {
month:string;
year:string;
  data: PieChartData[];  
  url = APIDetails.HelathAPI+"/Report/getExpCategoryWIse"; //;'https://localhost:44380/Report';  
  Category = [];  
  Amount = []; 
  
  CategoryIncome = [];  
  AmountIncome = [];

  CategoryFullFilter = [];  
  AmountFullFilter = []; 

  CategoryMY = [];  
  AmountMY = [];
  chart = [];  
  constructor(private httpClient: HttpClient) { }  
  
   ngOnInit() { 
     this.month = "1";
     this.year ="2021" ;
    this.httpClient.get(this.url+'/Expense').subscribe((result: PieChartData[]) => {  
      result.forEach(x => {  
        this.Category.push(x.Category);  
        this.Amount.push(x.Amount);  
      });     
     
    });  


    this.httpClient.get(this.url+'/Income').subscribe((result: PieChartData[]) => {  
      result.forEach(x => {  
        this.CategoryIncome.push(x.Category);  
        this.AmountIncome.push(x.Amount);  
      });  

    
    });  
    this.AllExpenseIncome();
  }
  
  AllExpenseIncome(){
    //getExpenseIncomeFilter(string BussinessType,string FilterTypeMonth, string FilterTypeYear, string FilterTypeAll)
     
    this.httpClient.get(APIDetails.HelathAPI+'/Report/getExpPerMonth/all/1/2021/Filter').subscribe((result: PieChartData[]) => {  
      result.forEach(x => {  
        this.CategoryFullFilter.push(x.Year);  
        this.AmountFullFilter.push(x.Amount);  
      });
    });
  }
  AllExpenseIncomeMonthYear(){
    this.DataAvail = true;
    //getExpenseIncomeFilter(string BussinessType,string FilterTypeMonth, string FilterTypeYear, string FilterTypeAll)
    this.CategoryMY =[];
    this.AmountMY=[];
    this.httpClient.get(APIDetails.HelathAPI+'/Report/getExpPerMonth/all/'+this.month+'/'+this.year+'/MonthYear').subscribe((result: PieChartData[]) => {  
      result.forEach(x => {  
        this.CategoryMY.push(x.BusinessType);  
        this.AmountMY.push(x.Amount);  
      });
      this.DataAvail = false;
    });
    this.piermonthyear();
  }
  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = this.Category;// [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public pieChartData: number[] =  this.Amount;;//[300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  //////////////income///////////
  public pieChartOptionsI: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabelsI: Label[] = this.CategoryIncome;// [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public pieChartDataI: number[] =  this.AmountIncome;//[300, 500, 100];
  public pieChartTypeI: ChartType = 'doughnut';
  public pieChartLegendI = true;
  //public pieChartPluginsI = [pluginDataLabels];
  public pieChartColorsI = [
    {
      backgroundColor: ['rgba(0,255,0,0.3)','rgba(255,0,0,0.3)',  'rgba(0,0,255,0.3)'],
    },
  ];
  ////ended here/////////////

  //////////////Full filter///////////
  public pieChartOptionsFF: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabelsFF: Label[] = this.CategoryFullFilter;// [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public pieChartDataFF: number[] =  this.AmountFullFilter;//[300, 500, 100];
  public pieChartTypeFF: ChartType = 'doughnut';
  public pieChartLegendFF = true;
  public pieChartPluginsFF = [pluginDataLabels];
  public pieChartColorsFF = [
    {
      backgroundColor: ['rgba(0,255,0,0.3)','rgba(255,0,0,0.3)',  'rgba(0,0,255,0.3)'],
    },
  ];
  ////ended here/////////////

   //////////////Moth Year filter///////////
   public pieChartOptionsMY: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabelsMY: Label[] = this.CategoryMY;// [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public pieChartDataMY: number[] =  this.AmountMY;//[300, 500, 100];
  public pieChartTypeMY: ChartType = 'pie';
  public pieChartLegendMY = true;
  public pieChartPluginsMY = [pluginDataLabels];
  public pieChartColorsMY = [
    {
      backgroundColor: ['rgba(0,0,255,0.3)','rgba(0,255,0,0.3)','rgba(255,0,0,0.3)'],
    },
  ];
  DataAvail:boolean = true;
  piermonthyear(){
    this.pieChartLabelsMY= this.CategoryMY;// [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  this.pieChartDataMY =  this.AmountMY;//[300, 500, 100];
  // if(this.CategoryMY.length <1){
  // this.DataAvail = true;
  // }
}
  ////ended here/////////////

}
