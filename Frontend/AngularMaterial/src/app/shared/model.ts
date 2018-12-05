export interface TipoObjeto {
    codigo: string;
    nome: string;
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
