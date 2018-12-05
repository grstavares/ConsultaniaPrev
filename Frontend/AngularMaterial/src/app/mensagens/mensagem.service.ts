import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mensagem } from './mensagem.model';

@Injectable({ providedIn: 'root' })
export class MensagemService {

  apiUrl = './assets/mensagens.json';
  public mensagens: Observable<Mensagem[]>;

  constructor(private http: HttpClient) {
    this.mensagens = this.http.get<Mensagem[]>(this.apiUrl);
  }

}
