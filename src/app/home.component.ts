import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Adresse } from './User';
import { addresseValidator } from './valid-address.directive';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    encapsulation: ViewEncapsulation.None
})


export class HomeComponent implements OnInit {

    ordersData = [
        { id: 100, name: 'order 11' },
        { id: 200, name: 'order 22' },
        { id: 300, name: 'order 33' },
        { id: 400, name: 'order 44' }
    ];

    orders = [
        { id: 100, name: 'order 1' },
        { id: 200, name: 'order 2' },
        { id: 300, name: 'order 3' },
        { id: 400, name: 'order 4' }
    ];
    form: FormGroup;
    addressForm: FormGroup;
    label1: FormControl;
    rue: FormControl;
    nomRue: FormControl;
    list: Adresse[] = [];
    adresse: Adresse = new Adresse();
    fa: FormArray;

    listAddres: Adresse[] = [
        { label1: 'labs1', rue: '2', nomRue: 'allerte' },
        { label1: 'Olabel', rue: '3', nomRue: 'allerte' }
    ];
    abc: number[] = [100, 200];
    constructor(private formBuilder: FormBuilder,private _Activatedroute:ActivatedRoute,
        private _router:Router) {

    }
sub;
sub1;
id;
id1;
page;
    ngOnInit() {

        this.sub=this._Activatedroute.paramMap.subscribe(params => { 
            //console.log(params);
             this.id = params.get('id'); 
             this.id1 = params.get('username'); 
            //  alert(this.id);
            //  alert(this.id1);
               
         });

         this.sub1 = this._Activatedroute.queryParams.subscribe(params => {
            this.page = params['username'] || 0;
            //alert(this.page)
        });
        const controlArray = this.orders.map(c => new FormControl(false));
        controlArray[0].setValue(true);
        this.form = this.formBuilder.group({
            orders: new FormArray(controlArray)
        });
        for (let i = 0; i < this.abc.length; i++) {
            controlArray[i].setValue(true);

        }
        this.addressForm = new FormGroup({
            firstName: new FormControl(''),
            lastName: new FormControl(''),
            age: new FormControl(''),
            stackDetails: new FormGroup({
                stack: new FormControl(''),
                experience: new FormControl('')               
            }),
            phaseExecutions: new FormGroup({
                PRE: this.formBuilder.array([this.addPhase()])

            }),
            adresses: this.formBuilder.array([]),
            orders: new FormArray(controlArray)
        });
        this.initFormArray(this.listAddres);
    }
    
    createForms(adresse): FormGroup {
        let formGroup: FormGroup = new FormGroup(
            {
                label1: new FormControl(adresse.label1),
                rue: new FormControl(adresse.rue),
                nomRue: new FormControl(adresse.nomRue)
            },
            {
                validators: addresseValidator
            }
        );
        return formGroup;
    }
    addPhase() {
        return this.formBuilder.group({
            country: new FormControl(''),
            city: new FormControl('')
            // country: [''],
            // city: ['']
        });
    }
    addMorePhase() {
        this.phaseArray.push(this.addPhase());
    }
    get phaseArray() {
        const control = <FormArray>(<FormGroup>this.addressForm.get('phaseExecutions')).get('PRE');
        return control;
    }

    initFormArray(adresse: Adresse[]) {
        const formArray = this.addressForm.get('adresses') as FormArray;
        adresse.map(item => {
            formArray.push(this.createForms(item));
        });
        this.addressForm.setControl('adresses', formArray);
    }

    get adresses() {
        return this.addressForm.get('adresses') as FormArray;
    }

    add() {
        this.adresses.push(this.createForms(this.adresse));
    }

    removeGroup(index) {
        const form = this.addressForm.get('adresses') as FormArray
        form.removeAt(index);
    }

    finish() {
        this.list = this.addressForm.value
        //console.log(this.list);
    }
}