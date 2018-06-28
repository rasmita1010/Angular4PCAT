import { DemoOfferMags } from '../../questions/manage-demos/manage-demos.component';

export class SubmitDemoRequest {
    DemoCode: string;
    DemoOfferCodes: string[];
    AssociatedMagazines: DemoOfferMags[];
    UserId: string;
    CommentText: string;
    UserName: string;
    constructor(_demoCOde: string, _demoOfferCodes: string[], _associatedMags: DemoOfferMags[], _userId: string, _commentTxt: string, _userName: string) {
        this.DemoCode = _demoCOde;
        this.DemoOfferCodes = _demoOfferCodes;
        this.AssociatedMagazines = _associatedMags;
        this.UserId = _userId;
        this.CommentText = _commentTxt;
        this.UserName = _userName;
    }
}

