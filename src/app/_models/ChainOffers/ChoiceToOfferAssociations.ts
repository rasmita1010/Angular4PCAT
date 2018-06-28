export class ChoiceToOfferAssociations {
    ParentDemoChoiceCode: string;
    ParentDemoChoiceText: string;
    ParentDemoChoiceId: number;
    ChildDemoOfferCode: string;
    hasPendingSubmission: boolean;
    constructor(_parentDemoChoiceCode: string,
        _parentDemoChoiceText: string,
        _parentDemoChoiceId: number,
        _childDemoOfferCode: string,
        _hasPendingSubmission: boolean) {
        this.ParentDemoChoiceCode = _parentDemoChoiceCode;
        this.ParentDemoChoiceText = _parentDemoChoiceText;
        this.ParentDemoChoiceId = _parentDemoChoiceId;
        this.ChildDemoOfferCode = _childDemoOfferCode;
        this.hasPendingSubmission = _hasPendingSubmission;
    }
}
