import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MonthNavigation } from '../models/models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableDatasourceService {

  private apiUrl = "https://localhost:7295/api/MonthsData";
  
  monthNavigationObservable = new Subject<MonthNavigation[]>();
  monthNavigationSelectedObservable = new Subject<MonthNavigation>();
  
  previousSavingsObservable = new Subject<{
    monthYear: string;
    monthNumber: string;
    sum: string;
  }>();

  currentSavingsRequestObservable = new Subject<{
    monthYear: string;
    monthNumber: string;
  }>(); 

    
  constructor(private http: HttpClient) {


   }

   getMonthList(){

    return this.http.get<any>(`${this.apiUrl}/GetListOfMonths`)
  
  }

  getTableRows(monthYear: string, monthNumber : string, tableName: string){

    let parameters = new HttpParams();

    parameters = parameters.append('monthYear', monthYear);
    parameters = parameters.append('monthNumber', monthNumber);
    parameters = parameters.append('tableName', tableName);

    return this.http.get<any>(`${this.apiUrl}/GetTableData`, {params : parameters})

  }

  postTableRow(monthDataForBackend : any){

    return this.http.post(`${this.apiUrl}/InsertTableRow`, monthDataForBackend , {responseType: 'text'});
  }

  deleteTableRow(rowId: number){

    return this.http.delete(`${this.apiUrl}/DeleteTableRow/` + rowId, {responseType : 'text'})
  }
}
