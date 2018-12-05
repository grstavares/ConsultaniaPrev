import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocumentosService } from './documentos.service';
import { Documento } from './documentos.model';

const ELEMENT_DATA: Documento[] = [];

@Component({ selector: 'app-documentos', templateUrl: './documentos.component.html', styleUrls: ['./documentos.component.scss']})
export class DocumentosComponent implements OnInit {

  displayedColumns: string[] = ['criacao', 'modificacao', 'nome', 'autor', 'tipo', 'link'];
  dataSource = ELEMENT_DATA;

  constructor(private http: HttpClient, private docService: DocumentosService) { }

  ngOnInit() {

    this.docService.documentos.subscribe(value => this.dataSource = value);

  }

}
