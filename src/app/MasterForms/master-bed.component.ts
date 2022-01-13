import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BookTicketResponseModel, BusSeatInfoModel } from '../models/UserData';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatCheckboxChange } from '@angular/material';
// import * as _moment from 'moment';
// import { Moment } from 'moment';

//const moment = _moment;
@Component({
  selector: 'app-master-bed',
  templateUrl: './master-bed.component.html',
  styleUrls: ['./master-bed.component.css']
})
export class MasterBedComponent implements OnInit {
  @Input() BedDetails: FormGroup;
  public bookingInfo: BookTicketResponseModel;
  public bookingForm: FormGroup;
  public availablseats: BusSeatInfoModel[] = [];
  public flag: boolean = true;
  public error: string;
  public res: any;
  Date1;
  todayDate:Date = new Date();
  events: string[] = [];
  @Output() getSearchStatusChange = new EventEmitter<boolean>();

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    //alert(event.value);
    this.events.push(`${type}: ${event.value}`);
  }
  constructor(private fb: FormBuilder,  public datePipe: DatePipe) {
    //this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    this.initateForm();
  }

  public ngOnInit(): void {
    //this.bookingInfo = mockResponse;
    let busTicketMockService = {
      type: "bus",
      seats: [{
        seatNo: 'DB001',
        status: "available",
        category: 2,
        bookedBy: "xyz",
        gender: "",
        row: 1,
        price: 350,
        facility: ['AC with attached bathroom', 'Nurses available']
      },
      {
        seatNo: 'DB002',
        status: "booked",
        category: 2,
        bookedBy: "xyz",
        gender: "",
        row: 1,
        price: 300,
        facility: ['AC with attached bathroom', ' Nurses available']
      },
      {
        seatNo: 'DB003',
        status: "available",
        category: 3,
        bookedBy: "",
        gender: "",
        row: 1,
        price: 300,
        facility: ['AC with attached bathroom ', ' Nurses available', ' 2 guests can be accomodate']
      },
      {
        seatNo: 'NB101',
        status: "available",
        category: 2,
        bookedBy: "vinod",
        gender: "",
        row: 2,
        price: 200,
        facility: ['Non AC 3 bed with attached bathroom ',' Nurses available']
      },
      {
        seatNo: 'NB102',
        status: "booked",
        category: 2,
        bookedBy: "vinod",
        gender: "",
        row: 2,
        price: 150,
        facility: ['Non AC 2 bed with attached bathroom ','Nurses available']
      },
      {
        seatNo: 'NB201',
        status: "available",
        category: 3,
        bookedBy: "",
        gender: "",
        row: 2,
        price: 100,
        facility: ['AC 5 bed with two attached bathroom ',' Nurses available','Word boy available']
      },
      {
        seatNo: 'NB204',
        status: "available",
        category: 3,
        bookedBy: "",
        gender: "",
        row: 2,
        price: 200,
        facility: ['AC 2 bed with attached bathroom ','  Nurses available']
      }


      ]
    };

    this.res = busTicketMockService;
    this.bookingInfo = this.res;
    this.availablseats = this.getAvailablseats();


  }

  public onSubmit(formValues: FormGroup): void {
    const userName: string = formValues.controls.name.value;
    const requiredSeats: number = parseInt(formValues.controls['count'].value);
    if (requiredSeats > this.availablseats.length) {
      this.error = "required seats not available";
    } else if (requiredSeats > 0) {
      this.checkInCategorys(userName, requiredSeats);
    }

  }

  public openBookingForm(): void {
    this.bookingForm.setValue({
      name: '',
      count: ''
    });
    this.flag = true;
    this.error = '';
  }

  private getAvailablseats(): BusSeatInfoModel[] {
    let availablseats: BusSeatInfoModel[] = []
    this.res.seats.forEach(seat => {
      if (seat.status === 'available') {
        availablseats.push(seat);
      }
    });
    return availablseats;
  }

  private checkInCategorys(name: string, count: number): void {
    let category2: BusSeatInfoModel[] = [];
    let category3: BusSeatInfoModel[] = [];
    let random: BusSeatInfoModel[] = [];
    if (count === 1) {
      category2 = this.checkInCategory(count, 2);
      if (category2.length !== 0) {
        this.bookSeat(category2, name);
      } else {
        category3 = this.checkInCategory(count, 3);
        if (category3.length !== 0) {
          this.bookSeat(category3, name);
        }
      }
    } else if (count === 2) {
      category2 = this.checkInCategory(count, 2);
      if (category2.length !== 0) {
        this.bookSeat(category2, name);
      } else {
        category3 = this.checkInCategory(count, 3);
        if (category3.length !== 0) {
          this.bookSeat(category3, name);
        } else {
          this.bookSeat(this.getRandomSeats(count), name);
        }

      }
    } else if (count === 3) {
      category3 = this.checkInCategory(count, 3);
      if (category3.length !== 0) {
        this.bookSeat(category3, name);
      } else {
        this.bookSeat(this.getRandomSeats(count), name);
      }
    } else {
      this.bookSeat(this.getRandomSeats(count), name);
    }

  }

  private bookSeat(bookseats: BusSeatInfoModel[], name: string): void {
    bookseats.forEach(seat => {
      const index: number = this.bookingInfo.seats.findIndex(data => data.seatNo === seat.seatNo);
      this.bookingInfo.seats[index].status = "booked";
      this.bookingInfo.seats[index].bookedBy = name;
    });

    this.availablseats = this.getAvailablseats();

    this.flag = false;
  }

  private checkInCategory(count: number, category: number): BusSeatInfoModel[] {
    let bookseats: BusSeatInfoModel[] = [];
    this.availablseats.forEach(seat => {
      if (bookseats.length < count) {
        if (seat.category === category) {
          bookseats.push(seat);
        }
        if (bookseats.length === count && count > 1) {
          bookseats = this.chekIfSameRow(bookseats);
        }
      }

    });
    if (bookseats.length === count) {
      return bookseats;
    } else {
      return [];
    }
  }

  private chekIfSameRow(bookseats: BusSeatInfoModel[]): BusSeatInfoModel[] {
    let row: number[] = [];
    bookseats.forEach(seat => {
      row.push(seat.row);
    })
    if (Array.from(new Set(row)).length === 1) {
      return bookseats;
    } else {
      const removeIndex = bookseats.splice(-1, 1);

      return removeIndex;
    }
  }

  private getRandomSeats(count: number): BusSeatInfoModel[] {
    let randomSeats: BusSeatInfoModel[] = [];
    this.availablseats.forEach(seat => {
      if (randomSeats.length < count) {
        randomSeats.push(seat)
      }
    });
    return randomSeats;
  }

  private initateForm(): void {
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      count: ['', Validators.required]
    });
  }

  showOptions(event:MatCheckboxChange): void {
    //alert(event.checked);
    // if(event.checked){
    //   this.BedDetails.get('Upgrade').patchValue(true);
    // }
    // else
    // {
    //   this.BedDetails.get('Upgrade').patchValue(false);
    // }
}
  seatFacility: any[];
  roomNo: string;
  ShowFacilities(facilitees: any[], roomno: string, price: string) {
    if(this.BedDetails.get('StartDate').value=='' || this.BedDetails.get('EndDate').value=='')
    {
      alert('Please select both the Admission and release date.');
    }
    else
    {
    this.seatFacility = facilitees;
    this.roomNo = roomno;
    this.BedDetails.get('BedNumber').patchValue(this.roomNo);
    this.BedDetails.get('BedPrice').patchValue(price);
    var kk= this.datePipe.transform("2021-01-06T18:30:00.000Z", 'dd-MM-yyyy');
    var kk= this.datePipe.transform("2021-01-06T18:30:00.000Z", 'dd-MM-yyyy');
    
    var date1 = new Date(this.BedDetails.get('StartDate').value);;//new Date(this.datepipe.transform(this.BedDetails.get('StartDate').value, 'dd/MM/yyyy'));
    var date2 = new Date(this.BedDetails.get('EndDate').value);
    // To calculate the time difference of two dates 
    var Difference_In_Time = date2.getTime() - date1.getTime();
   var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    this.BedDetails.get('Nofdays').patchValue(Difference_In_Days);

    this.BedDetails.get('TotalPrice').patchValue((Number(price)*Number(Difference_In_Days)).toString());
    this.getSearchStatusChange.emit(true);

    //var ppp = this.datePipe.transform(this.BedDetails.get('SatrtDate').value, 'dd-MM-yyyy');

    // var datePipe = new DatePipe('en-US');
    // var dateSelected =datePipe.transform("2021-01-15T18:30:00.000Z", 'dd/MM/yyyy');;
    //this.FullDayDBValueFormat =arg.dateStr;
    

    //this.BedDetails.get('StartDate').patchValue(moment("12/25/1995", "MM/DD/YYYY"));
    // this.BedDetails.patchValue({
    //   StartDate: moment("2021-01-15T18:30:00.000Z", "MM/DD/YYYY"),
      
    // });
    }


  }

}
