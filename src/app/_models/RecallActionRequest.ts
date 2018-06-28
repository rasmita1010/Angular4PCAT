export class RecallActionRequest {
    DemoCode: string;
    DemoOfferCode: string;
    UserId: string;
    UserEmailAddress: string;
    MagCodes: string[];
    IsPreferenceDB: boolean;

    constructor(_demoCode: string, _demoOfferCode: string, _userId: string, _userEmailAddress: string, _magCodes: string[], _isPreferenceDB: boolean) {
        this.DemoCode = _demoCode;
        this.DemoOfferCode = _demoOfferCode;
        this.UserId = _userId;
        this.UserEmailAddress = _userEmailAddress;
        this.MagCodes = _magCodes;
        this.IsPreferenceDB = _isPreferenceDB;
    }
}
