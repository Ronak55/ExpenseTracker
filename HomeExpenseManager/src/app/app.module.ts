import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { MonthsComponent } from './months/months.component';
import { MonthComponent } from './month/month.component';
import { TableComponent } from './table/table.component';
import { NumberToMonthPipe } from './Pipes/number-to-month.pipe';
import { MonthToNumberPipe } from './Pipes/month-to-number.pipe';
import { HttpClientModule } from '@angular/common/http';
import { TableDatasourceService } from './services/table-datasource.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SideNavComponent,
    MonthsComponent,
    MonthComponent,
    TableComponent,
    NumberToMonthPipe,
    MonthToNumberPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [TableDatasourceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
