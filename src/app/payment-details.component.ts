import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaymentHistory, PaymentParams } from './models/UserData';
import { PaymentHistoryService } from './Services/payment-history.service';
import { Expenses } from './shared/Expense.Model';
import { ExpensesService } from './shared/expenses.service';

@Component({
  selector: 'app-payment-details', 
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit {
  @Input() msgFromComponent: string;
  @Input() PaymentDetails: FormGroup;
  @Input() caseid: string;
  @Input() siblings: [];
  @Input() paymentParams: PaymentParams;
  @Input() ServiceType: string;
  @Input() TotalAmountRecived: string;
  showOnlyPatholabBillbox: boolean = false;

  constructor(private _fb: FormBuilder, private paymentHistoryService: PaymentHistoryService,
    private expenseService: ExpensesService,private datePipe: DatePipe) {

  }

  ReturnStatusColor() {
    var retColor = 'orange';
    let earlierPaymen1t = this.PaymentDetails.get('Balance').value;
    let earlierPayment = parseFloat(this.PaymentDetails.get('Balance').value == "" ? "0" : this.PaymentDetails.get('Balance').value)
    if (earlierPayment > 0) {
      retColor = "#D5F5E3";
    }
    else {
      retColor = "#F5B7B1";
    }
    //let bal = parseFloat(earlierPayment);;
    ////// this.PaymentDetails.get('Balance').patchValue(bal);
    return retColor;
  }

  ngOnInit() {
    // let grandTotal = Number(this.paymentParams?.OPD)+Number(this.paymentParams?.Doctor)+Number(this.paymentParams?.LabTest)+Number(this.paymentParams?.Bed);
    // this.PaymentDetails?.get('Amount').patchValue('500');
    // this.PaymentDetails?.get('Amount').patchValue(grandTotal);
    //alert(this.caseid);
    //alert(this.siblings);
    // if(this.ServiceType == '4'){
    //   this.showOnlyPatholabBillbox = true;

    // }
    // if(this.ServiceType == undefined){
    //   this.showOnlyPatholabBillbox = true;
    // }
    //this.showOnlyPatholabBillbox = true;

  }

  ngAfterViewInit() {
    //alert(this.caseid);
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   // only run when property "data" changed
  //   // alert(this.caseid);

  //   // let grandTotal = Number(this.paymentParams?.OPD)+Number(this.paymentParams?.Doctor)+Number(this.paymentParams?.LabTest)+Number(this.paymentParams?.Bed);
  //   // this.PaymentDetails?.get('Amount').patchValue('500');
  //   // this.PaymentDetails?.get('Amount').patchValue(grandTotal);
  // }
  disType: string = 'In Rupees';

  CalculatePercent() {
    let perval = this.PaymentDetails.get('Discount').value;
    this.disType = "With (" + perval + " %)"
    this.oninputChange('%');
  }



  oninputChange(per: string) {

    //alert('changed');
    if (this.caseid == null) {
      //let grandTotal = Number(this.paymentParams?.OPD) + Number(this.paymentParams?.Doctor) + Number(this.paymentParams?.LabTest) + Number(this.paymentParams?.Bed);
      //  this.paym
      //   this.PaymentDetails.get('Amount').patchValue('500');
      //   this.PaymentDetails.get('Amount').patchValue(grandTotal);
    }
    else {
      //   let grandTotal = Number(this.paymentParams?.OPD) + Number(this.paymentParams?.Doctor) + Number(this.paymentParams?.LabTest) + Number(this.paymentParams?.Bed);
      // this.PaymentDetails.get('Amount').patchValue('500');
      // this.PaymentDetails.get('Amount').patchValue(grandTotal);

    }
    //console.log(this.PaymentDetails.get('OPDCharge').value);
    let OPDCharge = parseFloat(this.PaymentDetails.get('OPDCharge').value == "" ? "0" : this.PaymentDetails.get('OPDCharge').value)
    let DoctorCharge = parseFloat(this.PaymentDetails.get('DoctorCharge').value == "" ? "0" : this.PaymentDetails.get('DoctorCharge').value)
    let LabTestCharge = parseFloat(this.PaymentDetails.get('LabTestCharge').value == "" ? "0" : this.PaymentDetails.get('LabTestCharge').value)
    let FarmaCharge = parseFloat(this.PaymentDetails.get('FarmaCharge').value == "" ? "0" : this.PaymentDetails.get('FarmaCharge').value)
    //let OTCharge = parseFloat("0")//parseFloat(this.PaymentDetails.get('OPDCharge').value)
    let OTCharge = parseFloat(this.PaymentDetails.get('OTCharge').value == "" ? "0" : this.PaymentDetails.get('OTCharge').value)

    let BedCharge = parseFloat(this.PaymentDetails.get('BedCharge').value == "" ? "0" : this.PaymentDetails.get('BedCharge').value)
    let DailyExpenseCharge = parseFloat(this.PaymentDetails.get('DailyExpense').value == "" ? "0" : this.PaymentDetails.get('DailyExpense').value)
    let OtherCharge = parseFloat(this.PaymentDetails.get('OtherCharge').value == "" ? "0" : this.PaymentDetails.get('OtherCharge').value)
    let RegdCharge = parseFloat(this.PaymentDetails.get('RegdCharge').value == "" ? "0" : this.PaymentDetails.get('RegdCharge').value)
    let NurseCharge = parseFloat(this.PaymentDetails.get('NurseCharge').value == "" ? "0" : this.PaymentDetails.get('NurseCharge').value)
    let AmbulanceCharge = parseFloat(this.PaymentDetails.get('AmbulanceCharge').value == "" ? "0" : this.PaymentDetails.get('AmbulanceCharge').value)
    let VaccinationCharge = parseFloat(this.PaymentDetails.get('VaccinationCharge').value == "" ? "0" : this.PaymentDetails.get('VaccinationCharge').value)
    
    let GTotal = OPDCharge + DoctorCharge + LabTestCharge + FarmaCharge + OTCharge + BedCharge + DailyExpenseCharge + OtherCharge+RegdCharge+NurseCharge+AmbulanceCharge+VaccinationCharge;
    this.PaymentDetails.get('Amount').patchValue(GTotal);
    var ct = 0;
    let price = this.PaymentDetails.get('Amount').value;
    let discount = this.PaymentDetails.get('Discount').value;
    if (per == "%") {
      //this.disType = "In Percent(%)";
      let ctDis = (parseFloat(discount) / 100) * parseFloat(price);
      this.PaymentDetails.get('Discount').patchValue(ctDis);
      ct = this.CalculateFinalPriceWithDiscountAmount(price, ctDis.toString());
    }
    else {
      this.disType = "In Rupees"
      ct = this.CalculateFinalPriceWithDiscountAmount(price, discount);
    }
    //this.PaymentDetails.get('EarlierPayment').patchValue('0');
    let earlierPayment = this.PaymentDetails.get('EarlierPayment').value;
    //let ct = this.CalculateFinalPriceWithDiscountAmount(price, discount);
    //let discountTotal = this.CalculateanyPercent(price, discount);
    // this.PaymentDetails.get('PaidAmount').patchValue(ct-earlierPayment);
    // let paidAmount = this.PaymentDetails.get('PaidAmount').value;

    //////let bal = parseFloat(price) - parseFloat(paidAmount)- parseFloat(earlierPayment);;
    ////// this.PaymentDetails.get('Balance').patchValue(bal);


    let paidAmount = this.PaymentDetails.get('PaidAmount').value;
    //this.addrFrom.get('PaymentDetails').get('EarlierPayment').patchValue('0');
    //let earlierPayment = this.addrFrom.get('PaymentDetails').get('EarlierPayment').value;
    let earlierPaymentInn = parseFloat(this.PaymentDetails.get('EarlierPayment').value == "" ? "0" : this.PaymentDetails.get('EarlierPayment').value)
    let disvalue = parseFloat(this.PaymentDetails.get('Discount').value == "" ? "0" : this.PaymentDetails.get('Discount').value)
    let paidVal = parseFloat(this.PaymentDetails.get('PaidAmount').value == "" ? "0" : this.PaymentDetails.get('PaidAmount').value)

    //this.addrFrom.get('PaymentDetails').get('PaidAmount').patchValue(ct - earlierPayment);
    //let bal =(parseFloat(price) - parseFloat(paidAmount)) - parseFloat(earlierPayment.toString());
    let bal = (parseFloat(price) - (paidVal + parseFloat(this.TotalAmountRecived)) - parseFloat(disvalue.toString())) - parseFloat(earlierPaymentInn.toString());
    this.PaymentDetails.get('Balance').patchValue(bal);
    //this.addrFrom.get('PaymentDetails').get('EarlierPayment').patchValue(bal);


  }
  onPaidChange() {
    //let paidAmount = this.PaymentDetails.get('PaidAmount').value;
    //this.PaymentDetails').get('EarlierPayment').patchValue('10');
    let earlierPayment = this.PaymentDetails.get('EarlierPayment').value;
    //let bal = parseFloat(price) - parseFloat(paidAmount)- parseFloat(earlierPayment);;


    let price = this.PaymentDetails.get('Amount').value;
    let discount = this.PaymentDetails.get('Discount').value;

    let paidAmount = this.PaymentDetails.get('PaidAmount').value;
    let balance = this.PaymentDetails.get('Balance').value;

    let ct = this.CalculateFinalPriceWithDiscountAmount(price, discount);
    let bal = ct - parseFloat(paidAmount) - parseFloat(earlierPayment);
    //let discountTotal = this.CalculateanyPercent(price, discount);
    this.PaymentDetails.get('PaidAmount').patchValue(paidAmount);
    //this.PaymentDetails.get('EarlierPayment').patchValue(EarlierPayment);
    this.PaymentDetails.get('Balance').patchValue(bal);

  }

  CalculateFinalPriceWithDiscountDiscount(price: string, discount: string): number {

    var result = (parseFloat(discount) / 100) * parseFloat(price);
    return (parseFloat(price) - result);
  }
  CalculateFinalPriceWithDiscountAmount(price: string, discount: string): number {

    // var result = (parseFloat(discount) / 100) * parseFloat(price);
    return (parseFloat(price) - parseFloat(discount));
  }

  SavePaymentDetails(CaseID: string) {
    // alert('called');
    //console.log(this.home.value);
    if(this.PaymentDetails.value.PaidAmount != 0 || parseFloat(this.PaymentDetails.value.EarlierPayment)!= 0)
{

    this.CreateStudent(this.PaymentDetails.value, CaseID);
}
  }
  employeeIdUpdate: string;
  CreateStudent(student: PaymentHistory, CaseID: string) {
    //this.employeeIdUpdate="12186089";
    if (this.employeeIdUpdate == null) {
      student.CaseID = CaseID;


      student.Description = "my descstring";
      student.PaidAmount = (student.PaidAmount + parseFloat(student.EarlierPayment));

      this.paymentHistoryService.createStudent(student).subscribe(
        (test) => {
          this.employeeIdUpdate = null;
        });
      if (student.PaidAmount != 0) {
        var typeOfTransaction = (student.PaidAmount > 0 ? "Income" : 'Expense')

        var objExpenseIncome: Expenses = new Expenses();
        objExpenseIncome.Date = this.datePipe.transform(new Date().toString(), 'MM/dd/yyyy'); //new Date().toString('MM/dd/yyyy');// student.PaidAmount.toString();
        objExpenseIncome.ExpenseAmount = student.PaidAmount.toString(); //(student.PaidAmount+parseFloat(student.EarlierPayment)).toString();
        objExpenseIncome.ExpenseCategory = 'From CASE:' + CaseID;
        objExpenseIncome.Notes = 'CASE Transaction';
        objExpenseIncome.CategoryName = typeOfTransaction;
        objExpenseIncome.BusinessType = typeOfTransaction;
        this.expenseService.createStudent(objExpenseIncome).subscribe(
          () => {
            //alert('saved into expenseincome')
            // this.dataSaved = "true";
            // this.dialogRef.close();
          });
      }
    } else {
      //var p = student.UnqueID;
      // this.addModifyCaseService.update(id,student).subscribe(() => {
      //   alert('Category data updated Successfully');
      //   this.employeeIdUpdate = null;

      // });
    }
  }

  OnRefundChangeRefund() {
    var refAmount = -1 * parseFloat(this.PaymentDetails.get('RefundAmount').value);
    this.PaymentDetails.get('PaidAmount').patchValue(refAmount);
    this.Refund();
  }

  Refund() {
    this.oninputChange('');

  }

}
