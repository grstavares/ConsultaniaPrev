import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Observable } from 'rxjs';

import { Segurado } from '../model';
import { SeguradosService } from '../service';
import { DocumentModalComponent } from 'src/app/shared/document-modal/document-modal.component';
import { RegistroPessoal } from 'src/app/shared';

@Component({ selector: 'app-segurado', templateUrl: './segurado.component.html', styleUrls: ['./segurado.component.scss'] })
export class SeguradoComponent implements OnInit {

  tableDocumentosColunas = ['position', 'tipo', 'numero', 'validade', 'acoes'];
  tableContatosColunas = [];
  tableEnderecosColunas = [];

  dataSourceDocumentos = [];
  dataSourceContatos = [];
  dataSourceEnderecos = [];

  userId: string;
  segurado: Segurado;

  constructor(route: ActivatedRoute, private service: SeguradosService, private dialog: MatDialog) {

    route.paramMap.subscribe( params => {

      const selectedId = params.get('id');
      this.userId = selectedId;
      this.service.getSegurado(selectedId).subscribe(value => {

        this.segurado = value;
        this.dataSourceDocumentos = value.documentos;
        this.dataSourceContatos = value.contatos;
        this.dataSourceEnderecos = value.enderecos;

      });

    });

   }

  ngOnInit() { }

  onItemClicked(row) {
    console.log(row);
  }

  showDocumento(index: number) {

    console.log('Show Item on Index ->' + index);
    const document = this.dataSourceDocumentos[index];
    this.openDocumentDialog(document, false);


  }

  editDocumento(index: number) {
    console.log('Edit Item on Index ->' + index);
  }

  openDocumentDialog(document: RegistroPessoal, editing: boolean) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { editMode: editing, payload: document};
    // this.dialog.open(DocumentModalComponent, dialogConfig);
    const dialogRef = this.dialog.open(DocumentModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        data => console.log('Dialog output:', data)
    );

}

}
