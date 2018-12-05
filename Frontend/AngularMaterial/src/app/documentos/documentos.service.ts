import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Documento } from './documentos.model';

@Injectable({providedIn: 'root'})
export class DocumentosService {

  apiUrl = './assets/documentos.json';
  public documentos: Observable<Documento[]>;

  constructor(private http: HttpClient) {
    this.documentos = this.http.get<Documento[]>(this.apiUrl);
  }

}
