import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Segurado } from './model';

@Injectable({providedIn: 'root'})
export class SeguradosService {

  apiUrl = './assets/pessoa/';

  constructor(private http: HttpClient) { }

  getSegurado(id: string): Observable<Segurado> {

    const objectUrl = this.apiUrl + id + '.json';
    return this.http.get<Segurado>(objectUrl);

  }

}
