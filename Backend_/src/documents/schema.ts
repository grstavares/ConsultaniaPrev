export interface Document {
    uuid: string;
    title: string;
    summary: string;
    dateCreation: number;
    lastUpdate?: number;
    url: string;
    wasDeleted: boolean;
}
