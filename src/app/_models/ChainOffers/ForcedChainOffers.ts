export class ForcedChainOffers {
    ParentDemoOfferCode: string;
    QuestionText: string;
    Mag_Code: string;
    MagazineName: string;
    ChildDemoOfferCode: string;
    ChildOfferQuestionText: string;
    constructor(_childDemoOfferCode: string,
        _childOfferQuestionText: string,
        _mag_Code: string,
        _magazineName: string,
        _parentDemoOfferCode: string,
        _questionText: string
    ) {
        this.ParentDemoOfferCode = _parentDemoOfferCode;
        this.QuestionText = _questionText;
        this.Mag_Code = _mag_Code;
        this.MagazineName = _magazineName;
        this.ChildDemoOfferCode = _childDemoOfferCode;
        this.ChildOfferQuestionText = _childOfferQuestionText;
    }
}
