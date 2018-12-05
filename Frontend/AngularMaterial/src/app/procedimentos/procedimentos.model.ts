import { TipoObjeto } from '../shared';

export interface AnexoProcedimento {
    dataCriacao: Date;
    autorId: string;
    autorNome: string;
    url: string;
    tipo: TipoObjeto;
    titulo: string;
    notas: string;
    status: 'ANEXADO' | 'DELETADO';
}

export interface AtividadeProcedimento {
    id: string;
    tipo: TipoObjeto;
    dataCriacao: Date;
    dataEncerramento: Date;
    criadorId: string;
    criadorNome: string;
    responsavelId: string;
    responsavelNome: string;
    status: TipoObjeto;
    titulo: string;
    descricao: string;
    notas: string;
    anexos: AnexoProcedimento[];
}

export interface Procedimento {
    id: string;
    displayId: string;
    tipo: TipoObjeto;
    dataCriacao: Date;
    dataEncerramento: Date;
    criadorId: string;
    criadorNome: string;
    interessadoId: string;
    interessadoNome: string;
    status: TipoObjeto;
    atividades: AtividadeProcedimento[];
}
