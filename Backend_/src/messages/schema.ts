export interface Message {
    institutionId: string;
    uuid: string;
    title: string;
    summary?: string;
    content: string;
    dateCreation: number;
    userOrigin: string;
    recipients: string[];
    wasDeleted: boolean;
}
