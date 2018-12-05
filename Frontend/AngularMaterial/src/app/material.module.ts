import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule } from '@angular/material';

const myDateFormatter = {
  parse: { dateInput: 'LL', },
  display: { dateInput: 'LL', monthYearLabel: 'MMM YYYY', dateA11yLabel: 'LL', monthYearA11yLabel: 'MMMM YYYY', },
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatSidenavModule, MatToolbarModule,
    MatDialogModule,
    MatListModule,
    MatTableModule,
    MatTabsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatRadioModule, MatCheckboxModule, 
    MatDatepickerModule, MatNativeDateModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule],
  exports: [
    MatSidenavModule, MatToolbarModule,
    MatDialogModule,
    MatListModule,
    MatTableModule,
    MatTabsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatRadioModule, MatCheckboxModule, 
    MatDatepickerModule, MatNativeDateModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
    providers: [
      {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
      {provide: MAT_DATE_FORMATS, useValue: myDateFormatter}
    ]
})
export class MaterialModule {}
