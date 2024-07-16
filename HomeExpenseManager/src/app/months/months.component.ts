import { Component, OnInit } from '@angular/core';
import { Month, MonthCalculation, MonthNavigation, Table } from '../models/models';
import { MonthToNumberPipe } from '../Pipes/month-to-number.pipe';
import { TableDatasourceService } from '../services/table-datasource.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-months',
  templateUrl: './months.component.html',
  styleUrl: './months.component.css'
})
export class MonthsComponent implements OnInit{

  months: Month[] = [];
  monthsToDisplay: Month[] = [];
  monthsNavigationList : MonthNavigation[] = [];

constructor(public api : TableDatasourceService){


}

ngOnInit(): void{

this.api.getMonthList().subscribe((res)=>{

  for(let item of res){
    this.addMonthByNumber(item.monthYear, item.monthNumber)
  }
   this.monthsToDisplay = this.months;
});

// will execute whenever a navigation is selected from side nav:

this.api.monthNavigationSelectedObservable.subscribe((res)=>{
  console.log(res);
  this.monthsToDisplay = this.filterMonths(res.monthYear,res.monthNumber);
})

}

filterMonths(monthYear : string, monthNumber : string) : Month[]{

 let filteredData : Month[] = [];

 if(monthYear === 'all'){

  if(monthNumber === 'all'){

    filteredData = this.months;

  } else{

  }


 } else{

  if(monthNumber === 'all'){

  } else{

   for(let month of this.months){
    if(month.monthYear === monthYear && month.monthNumber === monthNumber){
      filteredData.push(month);
      console.log(filteredData);
    }
   }
  }


 }

 return filteredData;

}

addNextMonth(){
  let nextYear: string = '';
  let nextMonth : string = '';

  if(this.months[0].monthNumber === '12'){
  
    nextMonth = '1';
    nextYear = (parseInt(this.months[0].monthYear) + 1).toString();
    

  } else{

    nextMonth = (parseInt(this.months[0].monthNumber) + 1).toString();
    nextYear = this.months[0].monthYear;
  }

  return this.addMonthByNumber(nextYear, nextMonth);
}

addMonthByNumber(monthYear: string, monthNumber: string)
{

  if(monthNumber != '0'){

    let expTable: Table = {
      tableName: 'Expenditure',
      columns:['date', 'name', 'amount'],
      rows: [],
      isSaved: false
    }

    let earningsTable: Table = {

      tableName: 'Earnings',
      columns:['date', 'name', 'amount'],
      rows: [],
      isSaved: false
      
    }

    let calcs: MonthCalculation[] = [
      {
        name : 'current-savings',
        value: '0',
        isSaved: false
      },
      {
        name: 'current-expenditure',
        value: '0',
        isSaved: false
      },
      {
        name:'current-earnings',
        value:'0',
        isSaved:false
      },
      {
        name:'previous-savings',
        value:'0',
        isSaved:false
      }
    ]

    
    let month: Month = {
      monthNumber: monthNumber,
      monthYear: monthYear,
      tables:[earningsTable, expTable],
      calculations:calcs,
      isSaved: false
    } 

     this.months.unshift(month);
     this.addMonthNavigation(monthYear, monthNumber);
     return true;
  }

  return false;

}

removeMonthNavigation(monthYear:string, monthNumber: string){

  this.monthsNavigationList.forEach((value, index)=>{

    if(value.monthNumber === monthNumber && value.monthYear === monthYear){
     
      this.monthsNavigationList.splice(index, 1);
   
    }
  });

  this.api.monthNavigationObservable.next(this.monthsNavigationList);
}

addMonthByName(monthYear: string, monthName: string){

let monthNumber = new MonthToNumberPipe().transform(monthName);
return this.addMonthByNumber(monthYear,monthNumber);

}

addMonthNavigation(monthYear:string, monthNumber:string){

  if(this.monthsNavigationList.length === 0){

    let firstmonthnav: MonthNavigation = {

      monthNumber: 'all',
      monthYear : 'all'
    }
   
    this.monthsNavigationList.unshift(firstmonthnav);
  }

  let monthNavigation: MonthNavigation = {
    monthNumber: monthNumber,
    monthYear : monthYear
  }

  this.monthsNavigationList.splice(1, 0, monthNavigation);

  this.api.monthNavigationObservable.next(this.monthsNavigationList);

}

deleteMonth(monthYear: string, monthName: string){

  let monthNumber = new MonthToNumberPipe().transform(monthName);

  let response = confirm("Are you sure?");

  if(response){

    this.months.forEach((month, index)=>{

      if(month.monthNumber === monthNumber && month.monthYear === monthYear){
        this.months.splice(index, 1);
      }
    })
  }

  this.removeMonthNavigation(monthYear, monthNumber);

}

} 
