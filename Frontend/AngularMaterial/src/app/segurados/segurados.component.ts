import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InstitutoService } from '../shared/instituto.service';
import { SeguradoItemList } from '../model';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: SeguradoItemList[] = [];

@Component({selector: 'app-segurados', templateUrl: './segurados.component.html', styleUrls: ['./segurados.component.scss'] })
export class SeguradosComponent implements OnInit {

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
