import { ChoiceChainOffers } from '../index';

export class ChoiceOffer {
    ParentDemoOfferCode: string;
    QuestionText: string;
    Mag_Code: string;
    MagazineName: string;
    ChildDemoCode: string;
    ChildOfferQuestionText: string;
    ChoiceChainOffers: ChoiceChainOffers[];
    constructor(_childDemoCode: string,
        _childOfferQuestionText: string,
        _choiceChainOffers: ChoiceChainOffers[],
        _mag_Code: string,
        _magazineName: string,
        _parentDemoOfferCode: string,
        _questionText: string
    ) {
        this.ParentDemoOfferCode = _parentDemoOfferCode;
        this.QuestionText = _questionText;
        this.Mag_Code = _mag_Code;
        this.MagazineName = _magazineName;
        this.ChildDemoCode = _childDemoCode;
        this.ChildOfferQuestionText = _childOfferQuestionText;
        this.ChoiceChainOffers = _choiceChainOffers;
    }
}
