import { Component, OnInit } from '@angular/core';
import { ColorPalette } from '../models/UserData';

export class NgxQrCode {
  text: string;
}



@Component({
  selector: 'app-bar-code-generation',
  templateUrl: './bar-code-generation.component.html',
  styleUrls: ['./bar-code-generation.component.css']
})
export class BarCodeGenerationComponent {
  value1:string= "sysdice";

  value2:string= "mutuka111";
  elementType = 'svg';
  value = 'someValue12340987';
  format = 'CODE128';
  lineColor = '#000000';
  width = 2;
  height = 100;
  displayValue = true;
  fontOptions = '';
  font = 'monospace';
  textAlign = 'center';
  textPosition = 'bottom';
  textMargin = 2;
  fontSize = 20;
  background = '#ffffff';
  margin = 10;
  marginTop = 10;
  marginBottom = 10;
  marginLeft = 10;
  marginRight = 10;

  background1 = 'green';
  foreground = 'white';

  public qrdata: string = null;

  constructor() {
    console.log('AppComponent running');
    this.qrdata = 'Initial QR code data string';
  }

  // printPage() {
  //   window.print();
  // }

  changeValue(newValue: string): void {
    this.qrdata = newValue;
  }

  updateBarColor(c: ColorPalette) {
    this.background1 = c.value;
    //this.background = c.value;
    this.lineColor = c.value;
    this.foreground = c.foreground;
  }
  updateBGColor(c: ColorPalette) {
    this.background1 = c.value;
    this.background = c.value;
    //this.lineColor = c.value;
    this.foreground = c.foreground;
  }

  get values(): string[] {
    return this.value.split('\n');
  }
  codeList: string[] = [
    'CODE128', 'CODE128A', 'CODE128B', 'CODE128C',
    'UPC', 'EAN8', 'EAN5', 'EAN2', 'CODE39', 'ITF14',
    'MSI', 'MSI10', 'MSI11', 'MSI1010', 'MSI1110',
    'pharmacode',
    'codabar'
  ];
}