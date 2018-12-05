import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MensagemService } from './mensagem.service';
import { Mensagem, MensagemStatus } from './mensagem.model';

const ELEMENT_DATA: Mensagem[] = [];

@Component({ selector: 'app-mensagens', templateUrl: './mensagens.component.html', styleUrls: ['./mensagens.component.scss'] })
export class MensagensComponent implements OnInit {

  displayedColumns: string[] = ['data', 'origem', 'destino', 'titulo', 'status'];
  dataSource = ELEMENT_DATA;

  constructor(private http: HttpClient, private mensagemService: MensagemService) { }

  ngOnInit() {

    this.mensagemService.mensagens.subscribe(value => this.dataSource = value);

  }

}
