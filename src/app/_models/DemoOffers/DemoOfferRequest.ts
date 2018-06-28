import { DemoOfferDetails } from './DemoOfferDetails';

export class DemoOfferRequest {

    DemoOfferDetails: DemoOfferDetails;
    IsAdd: boolean;
    UserId: string;
    IsDemoOfferChanged: boolean;
    IsScheduleDateChanged: boolean;
    IsDemoChoicesChanged: boolean;
    constructor(_demoOfferDetails: DemoOfferDetails, _isAdd: boolean, _UserId: string, _isDemoOfferChanged: boolean, _isScheduleDateChanged: boolean, _isDemoChoicesChanged: boolean) {
        this.DemoOfferDetails = _demoOfferDetails;
        this.IsAdd = _isAdd;
        this.UserId = _UserId;
        this.IsDemoOfferChanged = _isDemoOfferChanged;
        this.IsDemoChoicesChanged = _isDemoChoicesChanged;
        this.IsScheduleDateChanged = _isScheduleDateChanged;
    }
}
