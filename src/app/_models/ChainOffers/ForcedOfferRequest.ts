export class ForcedOfferRequest {

    ParentDemoOfferCode: string;
    ChildDDemoOfferCode: string;
    Mag_Code: string;
    MagazineName: string;
    isAdd: boolean;
    UserId: string;
    constructor(_parentDemoOfferCode: string, _childDDemoOfferCode: string, _mag_Code: string, _magazineName: string, _isAdd: boolean, _UserId: string) {
        this.ParentDemoOfferCode = _parentDemoOfferCode;
        this.ChildDDemoOfferCode = _childDDemoOfferCode;
        this.Mag_Code = _mag_Code;
        this.MagazineName = _magazineName;
        this.isAdd = _isAdd;
        this.UserId = _UserId;
    }
}
