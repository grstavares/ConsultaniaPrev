export interface Person {
    institutionId: string;
    uuid: string;
    firstName: string;
    lastName: string;
    username: string;                // Save E-mail Here
    phoneNumber?: string;            // Save only numbers, with CountryCode and DDD
    birthDate?: Date;
    genre?: string;
    wasDeleted: boolean;
}
