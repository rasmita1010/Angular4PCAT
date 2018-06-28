export class DeleteChainOfferRequest {
    DemoOfferCode: string;
    Mag_Code: string;
    OfferType: string;
    UserId: string;
    constructor(_demoOfferCode: string, _mag_Code: string, _offerType: string, _UserId: string) {
        this.DemoOfferCode = _demoOfferCode;
        this.Mag_Code = _mag_Code;
        this.OfferType = _offerType;
        this.UserId = _UserId;
    }
}
