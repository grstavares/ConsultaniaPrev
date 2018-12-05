import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

import { DocumentModalComponent } from './document-modal/document-modal.component';

@NgModule({
  declarations: [DocumentModalComponent],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  entryComponents: [DocumentModalComponent]
})
export class SharedModule { }
