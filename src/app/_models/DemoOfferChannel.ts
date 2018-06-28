export class DemoOfferChannel {
    DemoOfferCode: string;
    DemoOfferQuestionText: string;
    Mag_Code: string[];
    MagazineName: string;
    DemoOfferChoices: string[];
    Channel: string;
    constructor(_demoOfferCode: string, _demoOfferQnText: string, _magCode: string[], _magName: string, _demoOfferChoices: string[], _channel: string) {
        this.DemoOfferCode = _demoOfferCode;
        this.DemoOfferQuestionText = _demoOfferQnText;
        this.Mag_Code = _magCode;
        this.MagazineName = _magName;
        this.DemoOfferChoices = _demoOfferChoices;
        this.Channel = _channel;
    }
}
