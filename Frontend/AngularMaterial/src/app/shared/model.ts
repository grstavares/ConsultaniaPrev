export interface TipoObjeto {
    codigo: string;
    descricao: string;
}

export interface Endereco {
    tipo?: string;
    logradouro: string;
    numero: string;
    complemento: string;
    localidade: string;
    uf: string;
    cep: string;
}

export interface Contato {
    tipo?: string;
    modo: 'EMAIL' | 'TELEFONE' | 'FAX' | 'RECADO';
    contato: string;
    notas?: string;
}

export interface RegistroPessoal {
    tipo: string;
    numero: string;
    detalhes?: string;
    emissao?: Date;
    expiracao?: Date;
    emissor?: string;
}

export interface PoliticaAcesso {
    order: number;
    principal: string;
    resource: string[];
    action: string[];
    effect: string;
}

export interface ItemListaPessoa {
    id: string;
    name: string;
    birthDate: string;
}

export interface Instituto {
    id: string;
    name: string;
    segurados: ItemListaPessoa[];
    funcionarios: ItemListaPessoa[];
    grupos: { id: string, nome: string, membros: string[]};
    documentos: TipoObjeto[];               // Documentos com os quais o Instituto pode operar
    acl: PoliticaAcesso[];
}
