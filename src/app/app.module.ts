import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';

import {AppComponent} from './app.component';
import {HttpLoaderFactory} from './translate-loader';
import {OverviewComponent} from './overview/overview.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {RevenueListComponent} from './revenue-list/revenue-list.component';
import {CreateEditEntryComponent} from './create-edit-entry/create-edit-entry.component';
import {CreateEntryButtonComponent} from './create-entry-button/create-entry-button.component';

import {ButtonModule} from 'primeng/button';
import {ToolbarModule} from 'primeng/toolbar';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {InputNumberModule} from 'primeng/inputnumber';
import {CalendarModule} from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import {MessageService} from "primeng/api";

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    RevenueListComponent,
    ToolbarComponent,
    CreateEditEntryComponent,
    CreateEntryButtonComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    ToolbarModule,
    TableModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    CalendarModule,
    ToastModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
