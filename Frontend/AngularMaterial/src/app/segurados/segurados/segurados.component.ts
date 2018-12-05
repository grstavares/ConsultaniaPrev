import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InstitutoService, ItemListaPessoa } from '../../shared';

const ELEMENT_DATA: ItemListaPessoa[] = [];

@Component({selector: 'app-segurados', templateUrl: './segurados.component.html', styleUrls: ['./segurados.component.scss'] })
export class SeguradosComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'birthDate', 'link'];
  dataSource = ELEMENT_DATA;

  constructor(private http: HttpClient, private institutoService: InstitutoService) { }

  ngOnInit() {

    this.institutoService.instituto.subscribe(value => this.dataSource = value.segurados);

  }

  onItemClicked(row) {
    console.log(row);
  }

}
