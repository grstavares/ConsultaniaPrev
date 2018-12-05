export enum MensagemStatus {
    DRAFT = 'DRAFT',
    NEW = 'NEW',
    RECEIVED = 'RECEIVED',
    RESPONDED = 'RESPONDED',
    CLOSED = 'CLOSED',
    ARCHIVED = 'ARCHIVED'
}

export interface Mensagem {
    id: string;
    data: Date;
    origemId: string;
    origemName: string;
    destinoId: string;
    destinoName: string;
    titulo: string;
    conteudo: string;
    status: MensagemStatus;
    anexos: string[];
    thread?: string;                         // Armazena o id da mensagem que está sendo respondida
}
