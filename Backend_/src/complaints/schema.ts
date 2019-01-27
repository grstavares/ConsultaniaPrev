export interface Complaint {
    institutionId: string;
    uuid: string;
    title: string;
    content: string;
    dateCreation: number;
    dateReception?: number;
    status: string;                 // KnowValues: open, inEvaluation, inProgress, closed
    wasDeleted: boolean;
}
