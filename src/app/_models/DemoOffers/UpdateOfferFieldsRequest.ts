export class UpdateOfferFieldsRequest {

    DemoOfferList: any;
    IsVisiblityChanged: boolean;

    constructor(_demoOfferList: any, _isVisible: boolean) {
        this.DemoOfferList = _demoOfferList;
        this.IsVisiblityChanged = _isVisible;
    }
}
