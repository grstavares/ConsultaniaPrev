import { Component, OnInit } from '@angular/core';
import { InstitutoService, ItemListaPessoa } from '../../shared';
import { MatTableDataSource } from '@angular/material/table';

@Component({selector: 'app-segurados', templateUrl: './segurados.component.html', styleUrls: ['./segurados.component.scss'] })
export class SeguradosComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'birthDate', 'link'];
  dataSource = new MatTableDataSource<ItemListaPessoa>();

  constructor(private institutoService: InstitutoService) { }

  ngOnInit() {

    this.institutoService.instituto.subscribe(value => this.dataSource = new MatTableDataSource<ItemListaPessoa>(value.segurados));

  }

}
