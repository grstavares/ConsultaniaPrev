export interface NewsReport {
    uuid: string;
    title: string;
    contents: string;
    dateCreation: number;
    lastUpdate?: number;
    url?: string;
    imageUrl?: string;
    wasDeleted: boolean;
}
