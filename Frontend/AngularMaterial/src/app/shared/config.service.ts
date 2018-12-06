import { Injectable } from '@angular/core';
import { TipoObjeto } from './model';

@Injectable({ providedIn: 'root' })
export class ConfigService {

  constructor() { }

  enabledTypesRegistroPessoal(): TipoObjeto[] {

    return [
      {codigo: 'REG_FISCAL', descricao: 'CPF'},
      {codigo: 'REG_CIVIL', descricao: 'Registro Civil'},
      {codigo: 'REG_PROFISSIONAL', descricao: 'Registro Profissional'},
      {codigo: 'CERT_NASCIMENTO', descricao: 'Certidão de Nascimento'},
      {codigo: 'CERT_CASAMENTO', descricao: 'Certidão de Casamento'},
      {codigo: 'PASSAPORTE', descricao: 'Passaporte'},
      {codigo: 'REG_EMANCIPACAO', descricao: 'Registro da Emancipação'},
      {codigo: 'REG_OBITO', descricao: 'Registro de Óbito'}
    ];

  }

  enabledTypesContatos(): TipoObjeto[] {

    return [
      {codigo: 'CELULAR', descricao: 'Celular'},
      {codigo: 'RESIDENCIAL', descricao: 'Residencial'},
      {codigo: 'COMERCIAL', descricao: 'Comercial'},
      {codigo: 'RECADO', descricao: 'Recado'},
      {codigo: 'RESPONSAVEL', descricao: 'Responsável'},
      {codigo: 'PARENTES', descricao: 'Parentes'},
      {codigo: 'OUTROS', descricao: 'Outros'}
    ];

  }

  enabledTypesEnderecos(): TipoObjeto[] {

    return [
      {codigo: 'RESIDENCIAL', descricao: 'Residencial'},
      {codigo: 'COMERCIAL', descricao: 'Comercial'},
      {codigo: 'CAIXA_POSTAL', descricao: 'Caixa Postal'},
      {codigo: 'CORRESPONDENCIA', descricao: 'Correspondência'}
    ];

  }

}
