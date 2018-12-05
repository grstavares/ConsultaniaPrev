import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InstitutoService, ItemListaPessoa } from '../shared';

const ELEMENT_DATA: ItemListaPessoa[] = [];

@Component({ selector: 'app-ouvidoria', templateUrl: './ouvidoria.component.html', styleUrls: ['./ouvidoria.component.scss'] })
export class OuvidoriaComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'birthDate'];
  dataSource = ELEMENT_DATA;

  constructor(private http: HttpClient, private institutoService: InstitutoService) { }

  ngOnInit() {

    this.institutoService.instituto.subscribe(value => this.dataSource = value.segurados);

  }

  getConfig(url) {
    return this.http.get(url);
  }

}
