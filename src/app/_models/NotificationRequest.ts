export class NotificationRequest {
    UserID: string;
    MagCodes: string[];
    HasAllRecords: boolean;
    constructor(_userId: string, _magCode: string[], _hasAllRecords: boolean) {
        this.UserID = _userId;
        this.MagCodes = _magCode;
        this.HasAllRecords = _hasAllRecords;
    }
}