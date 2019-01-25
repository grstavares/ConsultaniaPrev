export interface Message {
    uuid: string;
    title: string;
    summary?: string;
    content: string;
    dateCreation: number;
    userOrigin: string;
    recipients: string[];
    wasDeleted: boolean;
}
