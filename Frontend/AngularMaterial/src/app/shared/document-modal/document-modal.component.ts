import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ConfigService } from '../config.service';
import { RegistroPessoal, TipoObjeto } from '../model';
import { ModalData } from '../types';
import * as moment from 'moment';

@Component({ selector: 'app-document-modal', templateUrl: './document-modal.component.html', styleUrls: ['./document-modal.component.scss'] })
export class DocumentModalComponent implements OnInit {

    form: FormGroup;
    isEditable: boolean;
    documento: RegistroPessoal;
    docTypes: TipoObjeto[];

    static validateFormDate(control: AbstractControl): { [key: string]: any } | null {

        if (control.value === null || control.value === undefined) { return null; }
        if (moment.isMoment(control.value))  { return null; }
        return { invalidDate : {valid: false, value: control.value }};

    }

    constructor(config: ConfigService, private dialogRef: MatDialogRef<DocumentModalComponent>, @Inject(MAT_DIALOG_DATA) data: ModalData<RegistroPessoal>) {

        this.docTypes = config.enabledTypesRegistroPessoal();
        this.isEditable = data.editEnabled;
        this.documento = data.payload;

    }

    ngOnInit() {

        this.form = this.createReactiveForm(this.documento, this.isEditable);

    }

    createReactiveForm(payload: RegistroPessoal, editEnabled: boolean): FormGroup {

        const nonNullPayload = payload ? payload : {tipo: '', numero: '', detalhes: '', emissao: null, expiracao: null, emissor: '' };
        const dtEmissao = (nonNullPayload.emissao === null || nonNullPayload.emissao === undefined) ? null : moment(nonNullPayload.emissao);
        const dtExpiracao = (nonNullPayload.expiracao === null || nonNullPayload.expiracao === undefined) ? null : moment(nonNullPayload.expiracao);

        // The object must be use the keys as string. In
        // the minify process they could not be renamed because
        // they will be referenced in html code.
        const newForm = new FormGroup({
            'tipo': new FormControl({ value: nonNullPayload.tipo, disabled: !editEnabled }, Validators.required),
            'numero': new FormControl({ value: nonNullPayload.numero, disabled: !editEnabled }, Validators.required),
            'detalhes': new FormControl({ value: nonNullPayload.detalhes, disabled: !editEnabled }),
            'emissao': new FormControl({ value: dtEmissao, disabled: !editEnabled }, DocumentModalComponent.validateFormDate),
            'expiracao': new FormControl({ value: dtExpiracao, disabled: !editEnabled }, DocumentModalComponent.validateFormDate),
            'emissor': new FormControl({ value: nonNullPayload.emissor, disabled: !editEnabled })
        });

        return newForm;

    }

    save() {

        const dtEmissao = (this.form.value.emissao === null || this.form.value.emissao === undefined) ? null : this.form.value.emissao.toDate();
        const dtExpiracao = (this.form.value.expiracao === null || this.form.value.expiracao === undefined) ? null : this.form.value.expiracao.toDate();

        const result: ModalData<RegistroPessoal> = {
            editEnabled: this.isEditable,
            payload: {
                tipo: this.form.value.tipo,
                numero: this.form.value.numero,
                detalhes: this.form.value.detalhes,
                emissao: dtEmissao,
                expiracao: dtExpiracao,
                emissor: this.form.value.emissor
            },
            updated: true,
        };

        this.dialogRef.close(result);

    }

    close() {
        const result: ModalData<RegistroPessoal> = {editEnabled: this.isEditable, payload: this.documento, updated: false };
        this.dialogRef.close(result);
    }

}
