import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ConfigService } from '../config.service';
import { Endereco, TipoObjeto } from '../model';
import { ModalData } from '../types';
import { HttpClient } from '@angular/common/http';
import { UiService } from '../ui.service';

@Component({ selector: 'app-endereco-modal', templateUrl: './endereco-modal.component.html', styleUrls: ['./endereco-modal.component.scss'] })
export class EnderecoModalComponent implements OnInit {


  form: FormGroup;
  isEditable: boolean;
  endereco: Endereco;
  docTypes: TipoObjeto[];

  static validateCEP(control: AbstractControl): { [key: string]: any } | null {

    if (control.value === null || control.value === undefined) { return null; }

    const clearedValue = control.value.replace('.', '').replace('-', '');
    const regex = new RegExp(/^[0-9]+$/);

    if (clearedValue.length === 8 && regex.test(clearedValue)) { return null; }
    return { invalidCep : {valid: false, value: control.value }};

}

  constructor(config: ConfigService, private uiService: UiService, private httpClient: HttpClient, private dialogRef: MatDialogRef<EnderecoModalComponent>, @Inject(MAT_DIALOG_DATA) data: ModalData<Endereco>) {

      this.docTypes = config.enabledTypesEnderecos();
      this.isEditable = data.editEnabled;
      this.endereco = data.payload;

  }

  ngOnInit() {

      this.form = this.createReactiveForm(this.endereco, this.isEditable);

  }

  createReactiveForm(payload: Endereco, editEnabled: boolean): FormGroup {

      const nonNullPayload: Endereco = payload ? payload : {tipo: '', logradouro: '', numero: '', complemento: '', bairro: '', localidade: '', uf: '', cep: '' };

      // The object must be use the keys as string. In
      // the minify process they could not be renamed because
      // they will be referenced in html code.
      const newForm = new FormGroup({
          'tipo': new FormControl({ value: nonNullPayload.tipo, disabled: !editEnabled }, Validators.required),
          'logradouro': new FormControl({ value: nonNullPayload.logradouro, disabled: !editEnabled }),
          'numero': new FormControl({ value: nonNullPayload.numero, disabled: !editEnabled }),
          'complemento': new FormControl({ value: nonNullPayload.complemento, disabled: !editEnabled }),
          'bairro': new FormControl({ value: nonNullPayload.bairro, disabled: !editEnabled }),
          'localidade': new FormControl({ value: nonNullPayload.localidade, disabled: !editEnabled }, Validators.required),
          'uf': new FormControl({ value: nonNullPayload.uf, disabled: !editEnabled }, Validators.required),
          'cep': new FormControl({ value: nonNullPayload.cep, disabled: !editEnabled }, [Validators.required, EnderecoModalComponent.validateCEP ])
      });

      return newForm;

  }

  searchCep() {

    const validationMustBeNull = EnderecoModalComponent.validateCEP(this.form.get('cep'));

    if (validationMustBeNull === null || validationMustBeNull === undefined) {

        const informedcep = this.form.get('cep').value;
        const querycep = informedcep.replace('.', '').replace('-', '');
        const queryUrl = 'https://viacep.com.br/ws/' + querycep + '/json/';
        const loadToken = this.uiService.startLoading();
        this.httpClient.get<Endereco>(queryUrl).toPromise().then(value => {

            this.form.patchValue(value);
            this.uiService.stopLoading(loadToken);

        });

    } else { this.uiService.showError(null, 'O CEP informado não é válido!'); }

  }

  save() {

      const result: ModalData<Endereco> = {
          editEnabled: this.isEditable,
          payload: {
              tipo: this.form.value.tipo,
              logradouro: this.form.value.logradouro,
              numero: this.form.value.numero,
              complemento: this.form.value.complemento,
              bairro: this.form.value.bairro,
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
