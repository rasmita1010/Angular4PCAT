export class DemoChoiceDetails {
    DemoChoiceId: number;
    DemoCode: string;
    DemoChoiceCode: string;
    DemoChoiceText: string;
    DemoOfferChoiceId: number;

    constructor(_demoChoiceId: number,
        _demoCode: string,
        _demoChoiceCode: string,
        _demoChoiceText: string,
        _demoOfferChoiceId: number) {
        this.DemoChoiceId = _demoChoiceId;
        this.DemoCode = _demoCode;
        this.DemoChoiceCode = _demoChoiceCode;
        this.DemoChoiceText = _demoChoiceText;
        this.DemoOfferChoiceId = _demoOfferChoiceId;
    }
}
