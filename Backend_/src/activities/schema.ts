export interface Activity {
    institutionId: string;
    uuid: string;
    title: string;
    contents: string;
    status: string;
    dateCreation: number;
    lastUpdate?: number;
    wasDeleted: boolean;
}
