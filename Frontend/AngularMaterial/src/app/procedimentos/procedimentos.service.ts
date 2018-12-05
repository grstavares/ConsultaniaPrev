import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Procedimento } from './procedimentos.model';

@Injectable({providedIn: 'root'})
export class ProcedimentosService {

  apiUrl = './assets/procedimentos.json';
  public procedimentos: Observable<Procedimento[]>;

  constructor(private http: HttpClient) {
    this.procedimentos = this.http.get<Procedimento[]>(this.apiUrl);
  }

}
