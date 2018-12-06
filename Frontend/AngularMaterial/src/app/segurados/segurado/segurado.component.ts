import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { parsePhoneNumber } from 'libphonenumber-js';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { Segurado } from '../model';
import { SeguradosService } from '../service';
import { DocumentModalComponent } from 'src/app/shared/document-modal/document-modal.component';
import { RegistroPessoal, Endereco, Contato, ModalData, UiService, EnderecoModalComponent, ContatoModalComponent, CanDeactivateGuard } from 'src/app/shared';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';

@Component({ selector: 'app-segurado', templateUrl: './segurado.component.html', styleUrls: ['./segurado.component.scss'] })
export class SeguradoComponent implements OnInit, CanDeactivateGuard {

  form: FormGroup;

  tableDocumentosColunas = ['position', 'tipo', 'numero', 'validade', 'acoes'];
  tableContatosColunas = ['position', 'tipo', 'modo', 'contato', 'acoes'];
  tableEnderecosColunas = ['position', 'tipo', 'endereco', 'acoes'];

  dataSourceDocumentos: MatTableDataSource<RegistroPessoal> = new MatTableDataSource<RegistroPessoal>();
  dataSourceContatos: MatTableDataSource<Contato> = new MatTableDataSource<Contato>();
  dataSourceEnderecos: MatTableDataSource<Endereco> = new MatTableDataSource<Endereco>();

  userId: string;
  segurado: Segurado;

  constructor(route: ActivatedRoute, private location: Location, private service: SeguradosService, private uiService: UiService, private dialog: MatDialog) {

    route.paramMap.subscribe(params => {

      const selectedId = params.get('id');
      this.userId = selectedId;
      this.service.getSegurado(selectedId).subscribe(value => {

        this.segurado = { ...value };
        this.dataSourceDocumentos = new MatTableDataSource<RegistroPessoal>(value.documentos);
        this.dataSourceContatos = new MatTableDataSource<Contato>(value.contatos);
        this.dataSourceEnderecos = new MatTableDataSource<Endereco>(value.enderecos);
        this.form.patchValue( {...value} );

      }, (error => {

        uiService.showError(error, 'Não foi possível carregar os dados do Segurado!', () => { this.location.back(); });

      }));

    });

  }

  ngOnInit() {

    this.form = this.createReactiveForm(this.segurado);

  }

  createReactiveForm(payload: Segurado): FormGroup {

    const editEnabled = true;
    const nonNullPayload: Segurado = payload ? payload : { id: '', nome: '', sexo: 'M', nomePai: '', nomeMae: '', dataNascimento: null, dataAdesao: null, localNascimento: '', documentos: [], enderecos: [], contatos: [] };
    const dtNascimento = (nonNullPayload.dataNascimento === null || nonNullPayload.dataNascimento === undefined) ? null : moment(nonNullPayload.dataNascimento);
    const dtAdesao = (nonNullPayload.dataAdesao === null || nonNullPayload.dataAdesao === undefined) ? null : moment(nonNullPayload.dataAdesao);

    // The object must be use the keys as string. In
    // the minify process they could not be renamed because
    // they will be referenced in html code.
    const newForm = new FormGroup({
      'nome': new FormControl({ value: nonNullPayload.nome, disabled: !editEnabled }, Validators.required),
      'sexo': new FormControl({ value: nonNullPayload.sexo, disabled: !editEnabled }, Validators.required),
      'nomePai': new FormControl({ value: nonNullPayload.nomePai, disabled: !editEnabled }),
      'nomeMae': new FormControl({ value: nonNullPayload.nomeMae, disabled: !editEnabled }),
      'dataNascimento': new FormControl({ value: dtNascimento, disabled: !editEnabled }, DocumentModalComponent.validateFormDate),
      'dataAdesao': new FormControl({ value: dtAdesao, disabled: !editEnabled }, DocumentModalComponent.validateFormDate),
      'localNascimento': new FormControl({ value: nonNullPayload.localNascimento, disabled: !editEnabled })
    });

    return newForm;

  }

  removeDocument(index: number) {

    const selected = this.segurado.documentos[index];

    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { titulo: 'Remover Documento', message: `Confirma a remoção do documento ${selected.tipo} ?`, okLabel: 'Confirmar' };
    dialogConfig.width = '40%';
    const dialogRef = this.dialog.open(ConfirmModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(confirmed => {

      if (confirmed) {
        this.segurado.documentos.splice(index, 1);
        this.dataSourceDocumentos = new MatTableDataSource<RegistroPessoal>(this.segurado.documentos);
      }

    });

  }

  openDocumentDialog(index: number, editing: boolean) {

    const document = this.dataSourceDocumentos.data[index];
    const data: ModalData<RegistroPessoal> = { editEnabled: editing, payload: document };
    const dialogConfig = new MatDialogConfig();

    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.width = '40%';

    const dialogRef = this.dialog.open(DocumentModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((returned: ModalData<RegistroPessoal>) => {

      if (returned && returned.updated) {

        this.segurado.documentos[index] = { ...returned.payload };
        this.dataSourceDocumentos = new MatTableDataSource<RegistroPessoal>(this.segurado.documentos);

      }

    });

  }

  describeContato(contato: Contato): string {

    if (contato.modo === 'TELEFONE' || contato.modo === 'FAX') {

      const value = contato.contato;
      try {
        const parsed = parsePhoneNumber(value);
        return parsed.format('National');
      } catch (error) { return value; }

    } else { return contato.contato; }

  }

  removeContato(index: number) {

    const selected = this.segurado.contatos[index];

    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { titulo: 'Remover Contato', message: `Confirma a remoção do contato ${this.describeContato(selected)} ?`, okLabel: 'Confirmar' };
    dialogConfig.width = '40%';
    const dialogRef = this.dialog.open(ConfirmModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(confirmed => {

      if (confirmed) {
        this.segurado.contatos.splice(index, 1);
        this.dataSourceContatos = new MatTableDataSource<Contato>(this.segurado.contatos);
      }

    });

  }

  openContatoDialog(index: number, editing: boolean) {

    const document = this.dataSourceContatos.data[index];
    const data: ModalData<Contato> = { editEnabled: editing, payload: document };
    const dialogConfig = new MatDialogConfig();

    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.width = '40%';

    const dialogRef = this.dialog.open(ContatoModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((returned: ModalData<Contato>) => {

      if (returned && returned.updated) {

        this.segurado.contatos[index] = { ...returned.payload };
        this.dataSourceContatos = new MatTableDataSource<Contato>(this.segurado.contatos);

      }

    });

  }

  describeEndereco(endereco: Endereco): string {

    let description = endereco.logradouro ? endereco.logradouro : '';
    description = description + (description.length > 0 && description.slice(-2) !== ', ' ? ', ' : '') + endereco.numero;
    description = description + (description.length > 0 && description.slice(-2) !== ', ' ? ', ' : '') + endereco.complemento;
    description = description + (description.length > 0 && description.slice(-2) !== ', ' ? ', ' : '') + endereco.localidade;
    description = description + (description.length > 0 && description.slice(-2) !== ', ' ? ', ' : '') + endereco.uf;
    description = description + (description.length > 0 && description.slice(-2) !== ', ' ? ', ' : '') + endereco.cep;
    return description;

  }

  removeEndereco(index: number) {

    const selected = this.segurado.enderecos[index];

    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { titulo: 'Remover Endereço', message: `Confirma a remoção do endereço ${this.describeEndereco(selected)} ?`, okLabel: 'Confirmar' };
    dialogConfig.width = '40%';
    const dialogRef = this.dialog.open(ConfirmModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(confirmed => {

      if (confirmed) {
        this.segurado.enderecos.splice(index, 1);
        this.dataSourceEnderecos = new MatTableDataSource<Endereco>(this.segurado.enderecos);
      }

    });

  }

  openEnderecoDialog(index: number, editing: boolean) {

    const endereco = this.dataSourceEnderecos.data[index];
    const data: ModalData<Endereco> = { editEnabled: editing, payload: endereco };
    const dialogConfig = new MatDialogConfig();

    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.width = '40%';

    const dialogRef = this.dialog.open(EnderecoModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((returned: ModalData<Endereco>) => {

      if (returned && returned.updated) {

        this.segurado.enderecos[index] = { ...returned.payload };
        this.dataSourceEnderecos = new MatTableDataSource<Endereco>(this.segurado.enderecos);

      }

    });

  }

  save() {console.log(this.form); }

  canDeactivate(): Observable<boolean> | boolean {

    if (!this.form.dirty) {return true; }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { titulo: 'Deseja Sair?', message: 'Suas informações não foram salvas. Se você confirmar as alterações realizadas serão perdidas!', okLabel: 'Confirmar' };
    dialogConfig.width = '40%';
    const dialogRef = this.dialog.open(ConfirmModalComponent, dialogConfig);

    return dialogRef.afterClosed();

  }

}
