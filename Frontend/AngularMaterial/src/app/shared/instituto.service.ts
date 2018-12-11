import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Instituto, TipoObjeto } from './model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UiService } from './ui.service';

interface Configuration {
  documentos: TipoObjeto[];
  procedimentos: TipoObjeto[];
}

@Injectable({ providedIn: 'root' })
export class InstitutoService {

  apiUrl = './assets/asdcvr1234567.json';
  configUrl = './assets/asdcvr1234567_doctypes.json';

  public instituto: Observable<Instituto>;
  public enabledDocumentos: Observable<TipoObjeto[]>;
  public enabledProcedimentos: Observable<TipoObjeto[]>;

  constructor(private http: HttpClient, private uiService: UiService) {

    this.instituto = this.http.get<Instituto>(this.apiUrl);

    this.enabledDocumentos = this.http.get<Configuration>(this.configUrl)
    .pipe(map((config) => config.documentos));

    this.enabledProcedimentos = this.http.get<Configuration>(this.configUrl)
    .pipe(map((config) => config.procedimentos));

  }

}
