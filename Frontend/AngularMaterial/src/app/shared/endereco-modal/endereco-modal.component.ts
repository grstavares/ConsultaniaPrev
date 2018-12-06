import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ConfigService } from '../config.service';
import { Endereco, TipoObjeto } from '../model';
import { ModalData } from '../types';

@Component({ selector: 'app-endereco-modal', templateUrl: './endereco-modal.component.html', styleUrls: ['./endereco-modal.component.scss'] })
export class EnderecoModalComponent implements OnInit {


  form: FormGroup;
  isEditable: boolean;
  endereco: Endereco;
  docTypes: TipoObjeto[];

  constructor(config: ConfigService, private dialogRef: MatDialogRef<EnderecoModalComponent>, @Inject(MAT_DIALOG_DATA) data: ModalData<Endereco>) {

      this.docTypes = config.enabledTypesEnderecos();
      this.isEditable = data.editEnabled;
      this.endereco = data.payload;

  }

  ngOnInit() {

      this.form = this.createReactiveForm(this.endereco, this.isEditable);

  }

  createReactiveForm(payload: Endereco, editEnabled: boolean): FormGroup {

      const nonNullPayload: Endereco = payload ? payload : {tipo: '', logradouro: '', numero: '', complemento: '', localidade: '', uf: '', cep: '' };

      // The object must be use the keys as string. In
      // the minify process they could not be renamed because
      // they will be referenced in html code.
      const newForm = new FormGroup({
          'tipo': new FormControl({ value: nonNullPayload.tipo, disabled: !editEnabled }, Validators.required),
          'logradouro': new FormControl({ value: nonNullPayload.logradouro, disabled: !editEnabled }),
          'numero': new FormControl({ value: nonNullPayload.numero, disabled: !editEnabled }),
          'complemento': new FormControl({ value: nonNullPayload.complemento, disabled: !editEnabled }),
          'localidade': new FormControl({ value: nonNullPayload.localidade, disabled: !editEnabled }, Validators.required),
          'uf': new FormControl({ value: nonNullPayload.uf, disabled: !editEnabled }, Validators.required),
          'cep': new FormControl({ value: nonNullPayload.cep, disabled: !editEnabled }, Validators.required)
      });

      return newForm;

  }

  save() {

      const result: ModalData<Endereco> = {
          editEnabled: this.isEditable,
          payload: {
              tipo: this.form.value.tipo,
              logradouro: this.form.value.logradouro,
              numero: this.form.value.numero,
              complemento: this.form.value.complemento,
              localidade: this.form.value.localidade,
              uf: this.form.value.uf,
              cep: this.form.value.cep
          },
          updated: true,
      };

      this.dialogRef.close(result);

  }

  close() {
      const result: ModalData<Endereco> = {editEnabled: this.isEditable, payload: this.endereco, updated: false };
      this.dialogRef.close(result);
  }

}
