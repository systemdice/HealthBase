import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatSelectChange } from '@angular/material';
import { ColorPalette } from '../models/UserData';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],  
  encapsulation: ViewEncapsulation.None
})
export class ColorPickerComponent{
  @Input() floatLabel = false;
  @Input() placeholder = "Color";
  @Output() selected = new EventEmitter<ColorPalette>();

  color: ColorPalette;
  colors: ColorPalette[] = [
    { name: 'Red', value: '#ff1744', foreground: 'white' },
    { name: 'Pink', value: '#ff80ab', foreground: 'black' },
    { name: 'Purple', value: '#d500f9', foreground: 'white' },
    { name: 'Deep Purple', value: '#7c4dff', foreground: 'white' },
    { name: 'Indigo', value: '#3d5afe', foreground: 'white' },
    { name: 'Blue', value: '#2979ff', foreground: 'white' },
    { name: 'Light Blue', value: '#00b0ff', foreground: 'black' },
    { name: 'Cyan', value: '#00e5ff', foreground: 'black' },
    { name: 'Teal', value: '#1de9b6', foreground: 'black' },
    { name: 'Green', value: '#00e676', foreground: 'black' },
    { name: 'Light Green', value: '#76ff03', foreground: 'black' },
    { name: 'Lime', value: '#c6ff00', foreground: 'black' },
    { name: 'Yellow', value: '#ffea00', foreground: 'black' },
    { name: 'Amber', value: '#ffc400', foreground: 'black' },
    { name: 'Orange', value: '#ff9100', foreground: 'black' },
    { name: 'Deep Orange', value: '#ff3d00', foreground: 'white' },
    { name: 'Brown', value: '#8d6e63', foreground: 'white' },
    { name: 'Light Gray', value: '#bdbdbd', foreground: 'black' },
    { name: 'Dark Gray', value: '#616161', foreground: 'white' },
    { name: 'Blue Gray', value: '#78909c', foreground: 'white' }
  ];

  constructor() {
    this.color = this.colors[0];
  }

  selectColor(c: ColorPalette) {
    this.color = c;
    this.selected.emit(c);
  }

  updateColor(event: MatSelectChange) {
    this.selectColor(event.value);
  }
}
