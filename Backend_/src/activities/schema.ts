export interface Activity {
    uuid: string;
    title: string;
    contents: string;
    status: string;
    dateCreation: number;
    lastUpdate?: number;
    wasDeleted: boolean;
}
