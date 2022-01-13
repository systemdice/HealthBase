import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-other-detail',
  templateUrl: './other-detail.component.html',
  styleUrls: ['./other-detail.component.css']
})
export class OtherDetailComponent implements OnInit {

  product;
  objectKeys = Object.keys;
  details;
 
     constructor(private router:Router, private activatedRoute:ActivatedRoute) {
          //console.log(this.router.getCurrentNavigation().extras.state);
     }
 
     ngOnInit() {
          //console.log(history.state);
          this.product=history.state;
     }

}
