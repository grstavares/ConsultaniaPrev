import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ConfigService } from '../config.service';
import { Contato, TipoObjeto } from '../model';
import { ModalData } from '../types';

@Component({ selector: 'app-contato-modal', templateUrl: './contato-modal.component.html', styleUrls: ['./contato-modal.component.scss'] })
export class ContatoModalComponent implements OnInit {

  form: FormGroup;
  isEditable: boolean;
  contato: Contato;
  docTypes: TipoObjeto[];
  enabledModos: string[] = ['EMAIL', 'TELEFONE', 'FAX', 'RECADO'];

  constructor(config: ConfigService, private dialogRef: MatDialogRef<ContatoModalComponent>, @Inject(MAT_DIALOG_DATA) data: ModalData<Contato>) {

      this.docTypes = config.enabledTypesContatos();
      this.isEditable = data.editEnabled;
      this.contato = data.payload;

  }

  ngOnInit() {

      this.form = this.createReactiveForm(this.contato, this.isEditable);

  }

  createReactiveForm(payload: Contato, editEnabled: boolean): FormGroup {

      const nonNullPayload: Contato = payload ? payload : {tipo: '', modo: '', contato: '', notas: ''};

      // The object must be use the keys as string. In
      // the minify process they could not be renamed because
      // they will be referenced in html code.
      const newForm = new FormGroup({
          'tipo': new FormControl({ value: nonNullPayload.tipo, disabled: !editEnabled }, Validators.required),
          'modo': new FormControl({ value: nonNullPayload.modo, disabled: !editEnabled }, Validators.required),
          'contato': new FormControl({ value: nonNullPayload.contato, disabled: !editEnabled }, Validators.required),
          'notas': new FormControl({ value: nonNullPayload.notas, disabled: !editEnabled })
      });

      return newForm;

  }

  save() {

      const result: ModalData<Contato> = {
          editEnabled: this.isEditable,
          payload: {
              tipo: this.form.value.tipo,
              modo: this.form.value.modo,
              contato: this.form.value.contato,
              notas: this.form.value.notas
          },
          updated: true,
      };

      this.dialogRef.close(result);

  }

  close() {
      const result: ModalData<Contato> = {editEnabled: this.isEditable, payload: this.contato, updated: false };
      this.dialogRef.close(result);
  }

}
