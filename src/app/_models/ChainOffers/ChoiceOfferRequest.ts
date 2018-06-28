import { ChoiceChainOffers } from '../index';

export class ChoiceOfferRequest {
    ParentDemoOffer: string;
    Mag_Code: string;
    MagazineName: string;
    isAdd: boolean;
    UserId: string;
    ChoiceChainOffers: ChoiceChainOffers[];
    ChildDemoCode: string;
    constructor(_parentDemoOffer: string, _mag_Code: string, _magazineName: string, _isAdd: boolean, _UserId: string, _choiceChainOffers: ChoiceChainOffers[],_childDemoCode:string) {
        this.ParentDemoOffer = _parentDemoOffer;
        this.Mag_Code = _mag_Code;
        this.MagazineName = _magazineName;
        this.isAdd = _isAdd;
        this.UserId = _UserId;
        this.ChoiceChainOffers = _choiceChainOffers;
        this.ChildDemoCode = _childDemoCode;
    }
}
