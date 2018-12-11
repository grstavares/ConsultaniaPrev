import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';

import { PhonePipe } from './phone-pipe/phone.pipe';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { DocumentModalComponent } from './document-modal/document-modal.component';
import { EnderecoModalComponent } from './endereco-modal/endereco-modal.component';
import { ContatoModalComponent } from './contato-modal/contato-modal.component';
import { CanDeactivateGuard } from './can-deactivate.guard';

@NgModule({
  declarations: [DocumentModalComponent, ConfirmModalComponent, PhonePipe, EnderecoModalComponent, ContatoModalComponent],
  imports: [CommonModule, FlexLayoutModule, MaterialModule, FormsModule, ReactiveFormsModule],
  entryComponents: [DocumentModalComponent, EnderecoModalComponent, ContatoModalComponent, ConfirmModalComponent],
  providers: [CanDeactivateGuard]
})
export class SharedModule { }
