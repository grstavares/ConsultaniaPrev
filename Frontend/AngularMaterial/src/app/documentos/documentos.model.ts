import { TipoObjeto, PoliticaAcesso } from '../shared';

export interface Documento {
    instituto: string;
    id: string;
    nome: string;
    resumo: string;
    autorId: string;
    autorNome: string;
    url: string;
    tipo: TipoObjeto;
    dataCriacao: Date;
    dataModificacao?: Date;
    acl: PoliticaAcesso[];
    versoes?: { expiracao: Date; url: string; };
}
