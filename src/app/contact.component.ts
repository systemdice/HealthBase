import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {ViewEncapsulation} from '@angular/core';

@Component({
     selector: 'app-contact',
     templateUrl: './contact.component.html',
     styleUrls: [ './contact.component.css' ]
   })

export class ContactComponent {
     title = 'angular-material';

     checked = false;
     disabled = false;
     favouriteCity = 'Mumbai';

     cities = ['New Delhi', 'Mumbai', 'Kolkata', 'Chennai'];
     selected = 'Mumbai';

     emailFormControl = new FormControl('', [
          Validators.required,
          Validators.email
     ]);

     selectedButton: string;

     onChange(event) {
          //console.log(event);
     }
}
