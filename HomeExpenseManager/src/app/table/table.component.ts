import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Table, TableRow } from '../models/models';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { TableDatasourceService } from '../services/table-datasource.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit{

  @Input() table : Table;
  @Input() monthNumber : string ='';
  @Input() monthYear : string ='';
  @Output() sumUpdated = new EventEmitter<number>();

  addRowForm: FormGroup;

  constructor(private api : TableDatasourceService){
    this.table = {
      tableName: '',
      columns: [],
      rows: [],
      isSaved:false
    };

    this.addRowForm = new FormGroup({});
  }

  ngOnInit(): void {
    
    this.addRowForm = new FormGroup({
      date : new FormControl('', [Validators.required, Validators.pattern('[0-9]*'),daysinMonthValidator(this.monthYear,this.monthNumber)]),
      name : new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.pattern('[0-9]*')])
    })

    this.api.getTableRows(this.monthYear, this.monthNumber, this.table.tableName).subscribe((res)=>{

      this.table.rows = [];

      for(let row of res){
        this.addRowtoArray(row.id, row.date, row.name, row.amount, true);
      }
    })
  }

  
public get dateControl() : FormControl{

  return this.addRowForm.controls['date'] as FormControl;
}

public get nameControl() : FormControl{

  return this.addRowForm.controls['name'] as FormControl;
}

public get amountControl() : FormControl{

  return this.addRowForm.controls['amount'] as FormControl;
}

public get RowForm(){

  return this.addRowForm as FormGroup;
}

addNewRow(){

  let date = this.dateControl.value;
  let name = this.nameControl.value;
  let amount = this.amountControl.value;

  let monthDataForBackend = {
    monthYear : this.monthYear,
    monthNumber : this.monthNumber,
    tableName: this.table.tableName,
    date: date,
    name: name,
    amount : amount
  };
  console.log(monthDataForBackend);
  this.api.postTableRow(monthDataForBackend).subscribe(res=>{
    this.addRowtoArray(parseInt(res), date, name, amount, true);
  })
}

addRowtoArray(
  id:number, 
  date:string,
  name:string, 
  amount:string, 
  isSaved: boolean){


    let row : TableRow = {

      id : id,
      date: date,
      name : name,
      amount: amount,
      isSaved: isSaved
    };

    this.table.rows.push(row);
    this.updateTheSum();
    this.clearForm();

}

editRow(rowId : number | undefined){

  if(this.dateControl.value === '' &&
  this.nameControl.value === '' && 
  this.amountControl.value === ''){

    this.table.rows.forEach((row, index)=>{

      if(rowId && row.id === rowId){
  
        this.dateControl.setValue(row.date);
        this.nameControl.setValue(row.name);
        this.amountControl.setValue(row.amount);
        this.deleteRow(row.id);
      }
    });

  } else{

    alert('First add pending row data');
  }



}

deleteRow(id: number | undefined){

  this.table.rows.forEach((row, index)=>{

    if(id && row.id === id){

      this.api.deleteTableRow(row.id).subscribe((res)=>{
        this.table.rows.splice(index, 1);
      })

    }

  });
}

clearForm(){
  this.dateControl.setValue('');
  this.nameControl.setValue('');
  this.amountControl.setValue('');
}

updateTheSum(){

  let sum = 0;
  this.table.rows.forEach((row, index)=>{
    sum += parseInt(row.amount);
  });

  this.sumUpdated.emit(sum);
}
}


// Validator function to check number of days in a given month


function daysinMonthValidator(
  monthYear: string,
  monthNumber: string
) : ValidatorFn {

return (control:AbstractControl) : {[key:string] : boolean} | null =>{

  if(parseInt(control.value) < 1 || parseInt(control.value) > getDaysInMonth(monthYear, monthNumber)){

    return {daysInvalid : true};
  }

  return null;
}
}

function getDaysInMonth(monthYear: string, monthNumber: string) : number{

  return new Date(parseInt(monthYear), parseInt(monthNumber), 0).getDate();
}
