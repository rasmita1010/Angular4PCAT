export class DigitalDemos {
    DemoCode: string;
    Description: string;
    DemoOfferCodes: string[];

    constructor(_demoCode: string,
        _description: string,
        _demoOfferCodes: string[]) {
        this.DemoCode = _demoCode;
        this.Description = _description;
        this.DemoOfferCodes = _demoOfferCodes;
    }
}
