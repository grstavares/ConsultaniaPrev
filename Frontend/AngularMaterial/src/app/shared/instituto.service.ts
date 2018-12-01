import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Instituto } from '../model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InstitutoService {

  apiUrl = './assets/instituto.json';
  public instituto: Observable<Instituto>;

  constructor(private http: HttpClient) {
    this.instituto = this.http.get<Instituto>(this.apiUrl);
  }

}
