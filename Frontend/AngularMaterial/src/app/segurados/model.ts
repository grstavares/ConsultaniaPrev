import { Endereco, Contato, RegistroPessoal } from '../shared/model';

export interface Segurado {
    id: string;
    nome: string;
    sexo: 'M' | 'F';
    nomePai?: string;
    nomeMae?: string;
    dataNascimento: Date;
    localNascimento: string;
    dataAdesao: Date;
    documentos: RegistroPessoal[];
    enderecos: Endereco[];
    contatos: Contato[];
}
