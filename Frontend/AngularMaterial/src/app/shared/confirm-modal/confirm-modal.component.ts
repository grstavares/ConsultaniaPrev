import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ConfirmModalData } from '../types';

@Component({ selector: 'app-confirm-modal', templateUrl: './confirm-modal.component.html', styleUrls: ['./confirm-modal.component.scss'] })
export class ConfirmModalComponent implements OnInit {

  titulo = 'Confirmação';
  message = 'no message!';
  okLabel = 'Ok';
  cancelLabel = 'Cancelar';

  constructor(private dialogRef: MatDialogRef<ConfirmModalComponent>, @Inject(MAT_DIALOG_DATA) data: ConfirmModalData) {

    this.message = data.message;
    if (data.titulo) {this.titulo = data.titulo; }
    if (data.okLabel) { this.okLabel = data.okLabel; }
    if (data.cancelLabel) { this.cancelLabel = data.cancelLabel; }

  }

  ngOnInit() {}

  closeModal(confirmed: boolean) { this.dialogRef.close(confirmed); }

}
