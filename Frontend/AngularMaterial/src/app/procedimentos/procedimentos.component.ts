import { Component, OnInit } from '@angular/core';
import { ProcedimentosService } from './procedimentos.service';
import { Procedimento } from './procedimentos.model';

const ELEMENT_DATA: Procedimento[] = [];

@Component({ selector: 'app-procedimentos', templateUrl: './procedimentos.component.html', styleUrls: ['./procedimentos.component.scss'] })
export class ProcedimentosComponent implements OnInit {

  displayedColumns: string[] = ['displayId', 'tipo', 'dataCriacao', 'dataModificacao', 'interessado', 'status'];
  dataSource = ELEMENT_DATA;

  constructor(private service: ProcedimentosService) { }

  ngOnInit() {

    this.service.procedimentos.subscribe(value => this.dataSource = value);

  }

  maxAtualizacao(procedimento: Procedimento): Date {
    return null;
  }

}
