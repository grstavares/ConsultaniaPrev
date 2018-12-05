import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RegistroPessoal } from '../model';

@Component({ selector: 'app-document-modal', templateUrl: './document-modal.component.html', styleUrls: ['./document-modal.component.scss'] })
export class DocumentModalComponent implements OnInit {

  form: FormGroup;
  documento: RegistroPessoal;

  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<DocumentModalComponent>,
      @Inject(MAT_DIALOG_DATA) data) {

      this.documento = data.payload;

  }

  ngOnInit() {
      this.form = this.fb.group({
          tipo: this.documento.tipo,
      });
  }

  save() {
      this.dialogRef.close(this.form.value);
  }

  close() {
      this.dialogRef.close();
  }

}
