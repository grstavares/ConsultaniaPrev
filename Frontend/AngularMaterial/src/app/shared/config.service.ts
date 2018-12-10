import { Injectable } from '@angular/core';
import { TipoObjeto } from './model';

@Injectable({ providedIn: 'root' })
export class ConfigService {

  constructor() { }

  private typesRegistro = [
    {codigo: 'REG_FISCAL', descricao: 'CPF'},
    {codigo: 'REG_CIVIL', descricao: 'Registro Civil'},
    {codigo: 'REG_PROFISSIONAL', descricao: 'Registro Profissional'},
    {codigo: 'CERT_NASCIMENTO', descricao: 'Certidão de Nascimento'},
    {codigo: 'CERT_CASAMENTO', descricao: 'Certidão de Casamento'},
    {codigo: 'PASSAPORTE', descricao: 'Passaporte'},
    {codigo: 'REG_EMANCIPACAO', descricao: 'Registro da Emancipação'},
    {codigo: 'REG_OBITO', descricao: 'Registro de Óbito'}
  ];

  private typesContato = [
    {codigo: 'CELULAR', descricao: 'Celular'},
    {codigo: 'RESIDENCIAL', descricao: 'Residencial'},
    {codigo: 'COMERCIAL', descricao: 'Comercial'},
    {codigo: 'RECADO', descricao: 'Recado'},
    {codigo: 'RESPONSAVEL', descricao: 'Responsável'},
    {codigo: 'PARENTES', descricao: 'Parentes'},
    {codigo: 'OUTROS', descricao: 'Outros'}
  ];

  private typesEndereco = [
      {codigo: 'RESIDENCIAL', descricao: 'Residencial'},
      {codigo: 'COMERCIAL', descricao: 'Comercial'},
      {codigo: 'CAIXA_POSTAL', descricao: 'Caixa Postal'},
      {codigo: 'CORRESPONDENCIA', descricao: 'Correspondência'}
  ];

  enabledTypesRegistroPessoal(): TipoObjeto[] { return this.typesRegistro.map(x => Object.assign({}, x)); }

  describeTypeRegistroPessoal(type: string): string {
    const filtered = this.typesRegistro.filter(x => x.codigo.toLowerCase() === type.toLowerCase() );
    if (filtered.length > 0) {return filtered[0].descricao; } else {return ''; }
  }

  enabledTypesContatos(): TipoObjeto[] { return this.typesContato.map(x => Object.assign({}, x)); }

  describeTypeContato(type: string): string {
    const filtered = this.typesContato.filter(x => x.codigo.toLowerCase() === type.toLowerCase() );
    if (filtered.length > 0) {return filtered[0].descricao; } else {return ''; }
  }

  enabledTypesEnderecos(): TipoObjeto[] { return this.typesEndereco.map(x => Object.assign({}, x)); }

  describeTypeEndereco(type: string): string {
    const filtered = this.typesEndereco.filter(x => x.codigo.toLowerCase() === type.toLowerCase() );
    if (filtered.length > 0) {return filtered[0].descricao; } else {return ''; }
  }

}
