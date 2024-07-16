import { Component, OnInit, Input } from '@angular/core';
import { Month } from '../models/models';
import { TableDatasourceService } from '../services/table-datasource.service';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrl: './month.component.css'
})
export class MonthComponent implements OnInit{

  @Input() month : Month;

  constructor(private datasource : TableDatasourceService){

    this.month = {
      monthYear: '',
      monthNumber:'',
      tables:[],
      calculations:[],
      isSaved: false
    }
  }

  ngOnInit(): void {
    
    this.datasource.previousSavingsObservable.subscribe((res)=>{

      if(this.month.monthYear === res.monthYear && this.month.monthNumber === res.monthNumber){
        this.setCalculation('previous-savings', res.sum);
      }

    });

    this.datasource.currentSavingsRequestObservable.subscribe((res)=>{

      if(this.month.monthYear === res.monthYear && this.month.monthNumber === res.monthNumber){

         this.currentSavingsUpdated();
      }

    });

    // this month will send the request, to get the current savings value of previous month

     let pd = this.getPreviousDate(this.month.monthYear, this.month.monthNumber);

     this.datasource.currentSavingsRequestObservable.next({
      monthYear: pd.monthYear,
      monthNumber: pd.monthNumber
     })
  }

  sumUpdated(tableName : string, sum : number){

    if(tableName === 'Earnings'){

      this.setCalculation('current-earnings', sum.toString());
  
    } else{

     this.setCalculation('current-expenditure',sum.toString());

    }
  }

  setCalculation(name: string, sum: string){

    this.month.calculations.forEach((value,index)=>{

      if(value.name === name){
        value.value = sum;
      }
    })

    this.setCurrentSavings();
  }

  getCalulation(name : string) : number{

    let sum = '0';

    this.month.calculations.forEach((value,index)=>{
      if(value.name === name){

        sum = value.value;
      }
    });

    return parseInt(sum);
  }

  setCurrentSavings(){

    let ps = this.getCalulation('previous-savings');
    let ce = this.getCalulation('current-earnings');
    let cx = this.getCalulation('current-expenditure');

    let cs = ps + ce - cx;

    this.month.calculations.forEach((value, index)=>{
      if(value.name === 'current-savings'){
        value.value = cs.toString();
      }
    });

    this.currentSavingsUpdated();
  }

  // this will send the value of current savings into previous savings observable
  // so that the next monthcan take it as its previous savings

  currentSavingsUpdated(){

    let nd = this.getNextDate(this.month.monthYear, this.month.monthNumber);

    this.datasource.previousSavingsObservable.next({
      monthYear : nd.monthYear,
      monthNumber : nd.monthNumber,
      sum: this.getCalulation('current-savings').toString()
    })
  }

  getPreviousDate(monthYear : string, monthNumber : string) : {monthYear: string; monthNumber: string}{

    let temp = parseInt(monthNumber);

    let pm = temp == 1 ? '12' : (temp-1).toString();

    let py = pm === '12' ? (parseInt(monthYear) - 1).toString() : monthYear;

    return {monthYear : py, monthNumber : pm};
  }

  getNextDate(monthYear : string, monthNumber : string) : {monthYear: string; monthNumber: string}{

   let temp = parseInt(monthNumber);

   let nm = temp == 12 ? '1' : (temp+1).toString();

   let ny = nm === '1' ? (parseInt(monthYear) + 1).toString() : monthYear;

   return {monthYear : ny , monthNumber : nm};
  }
}
