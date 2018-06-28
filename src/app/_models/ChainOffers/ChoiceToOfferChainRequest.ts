import { ChoiceToOfferAssociations } from '../index';

export class ChoiceToOfferChainRequest {
    ParentDemoOffer: string;
    Mag_Code: string;
    MagazineName: string;
    isAdd: boolean;
    UserId: string;
    ChoiceToOfferChains: ChoiceToOfferAssociations[];
    ChildDemoCode: string;
    constructor(_parentDemoOffer: string, _mag_Code: string, _magazineName: string, _isAdd: boolean, _UserId: string, _choiceToOfferChains: ChoiceToOfferAssociations[],_childDemoCode:string) {
        this.ParentDemoOffer = _parentDemoOffer;
        this.Mag_Code = _mag_Code;
        this.MagazineName = _magazineName;
        this.isAdd = _isAdd;
        this.UserId = _UserId;
        this.ChoiceToOfferChains = _choiceToOfferChains;
        this.ChildDemoCode = _childDemoCode;
    }
}
