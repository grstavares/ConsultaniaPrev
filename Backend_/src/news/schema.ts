export interface NewsReport {
    institutionId: string;
    itemId: string;
    title: string;
    contents: string;
    dateCreation: number;
    lastUpdate?: number;
    url?: string;
    imageUrl?: string;
    wasDeleted: boolean;
}

export class ObjectModel implements NewsReport {
    public institutionId: string;
    public itemId: string;
    public title: string;
    public contents: string;
    public dateCreation: number;
    public lastUpdate?: number;
    public url?: string;
    public imageUrl?: string;
    public wasDeleted: boolean;
}
