export class ChoiceChainOffers {
    ParentDemoChoiceCode: string;
    ParentDemoChoiceText: string;
    ParentDemoOfferChoiceId: number;
    ChildDemoChoiceCode: string;
    ChildDemoCHoiceText: string;
    ChildDemoChoiceId: number;
    hasPendingSubmission: boolean;
    constructor(_parentDemoChoiceCode: string,
        _parentDemoChoiceText: string,
        _parentDemoOfferChoiceId: number,
        _childDemoChoiceCode: string,
        _childDemoCHoiceText: string,
        _childDemoChoiceId: number,
        _hasPendingSubmission: boolean) {
        this.ParentDemoChoiceCode = _parentDemoChoiceCode;
        this.ParentDemoChoiceText = _parentDemoChoiceText;
        this.ParentDemoOfferChoiceId = _parentDemoOfferChoiceId;
        this.ChildDemoChoiceCode = _childDemoChoiceCode;
        this.ChildDemoCHoiceText = _childDemoCHoiceText;
        this.ChildDemoChoiceId = _childDemoChoiceId;
        this.hasPendingSubmission = _hasPendingSubmission;
    }
}
