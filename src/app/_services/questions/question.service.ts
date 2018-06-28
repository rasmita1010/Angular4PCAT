import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Rx';
import { PreferenceDataService } from '../preference-data.service';

@Injectable()
export class QuestionService {
    private PCATServiceURL = environment.PCATServiceURL;

    constructor(private _preferenceService: PreferenceDataService) { }

    // Search democode by keywords
    getQuestionsOnSearch(searchArray: any): Observable<any> {
        let params = new URLSearchParams();
        params.append('keywords', searchArray);
        const url = this.PCATServiceURL + '/DemoCode/GetByKeywords';
        return this._preferenceService.authGet(url, params);
    }

    // Get the list of answer types
    getAnswerTypes(): Observable<any> {
        const url = this.PCATServiceURL + '/DemoCode/GetAnswerTypes';
        return this._preferenceService.authGet(url,null);
    }

    // Get the list of demo choices of particular demo code
    getDemoChoices(demoCode: string): Observable<any> {
        let params = new URLSearchParams();
        params.append('demoCode', demoCode);
        const url = this.PCATServiceURL + '/DemoCode/GetDemoChoices';
        return this._preferenceService.authGet(url, params);
    }

    // To create demo code lock for current user
    createDemoCodeLock(demoCode: string, userId: string, userName: string): Observable<any> {
        let params = new URLSearchParams();
        params.append('demoCode', demoCode);
        params.append('userId', userId);
        params.append('userName', userName);
        const url = this.PCATServiceURL + '/DemoCode/CreateDemoCodeLock';
        return this._preferenceService.authGet(url, params);
    }

    // To reset the demo code lock
    resetDemoCodeLock(demoCode: string): Observable<any> {
        let params = new URLSearchParams();
        params.append('demoCode', demoCode);
        const url = this.PCATServiceURL + '/DemoCode/ResetDemoCodeLock';
        return this._preferenceService.authGet(url, params);
    }

    // To check if demo code question already exists
    checkQuestionAlreadyExists(demoCodeInfo): Observable<any> {
        const url = this.PCATServiceURL + '/DemoCode/CheckIfQuestionAlreadyExists';
        return this._preferenceService.authPost(url, demoCodeInfo);
    }

    // Check the code is unique across system
    checkCodeIsUnique(demoCode: string, type: string): Observable<any> {
        let params = new URLSearchParams();
        params.append('code', demoCode);
        params.append('type', type);
        const url = this.PCATServiceURL + '/DemoCode/CheckCodeIsUnique';
        return this._preferenceService.authGet(url, params);
    }

    // Check the code is unique in demo code table
    checkCodeIsUniqueInDemoCode(code: string, demoCode: string, action: string, type: string): Observable<any> {
        let params = new URLSearchParams();
        params.append('code', code);
        params.append('demoCode', demoCode);
        params.append('type', type);
        params.append('action', action);
        const url = this.PCATServiceURL + '/DemoCode/CheckCodeIsUniqueInDemoCode';
        return this._preferenceService.authGet(url, params);
    }

    // To Save a demo Code
    saveDemoCode(demooCodeInfo): Observable<any> {
        const url = this.PCATServiceURL + '/DemoCode/InsertDemoCode';
        return this._preferenceService.authPost(url, demooCodeInfo);
    }

    // To edit existing demo code
    updateDemoCode(demooCodeInfo): Observable<any> {
        const url = this.PCATServiceURL + '/DemoCode/UpdateDemoCodeDetails';
        return this._preferenceService.authPost(url, demooCodeInfo);
    }

    // To View a Demo Code
    ViewDemoCode(demoCode: string, userId: string, userName: string): Observable<any> {
        let params = new URLSearchParams();
        params.append('demoCode', demoCode);
        params.append('userId', userId);
        params.append('userName', userName);
        const url = this.PCATServiceURL + '/DemoCode/View';
        return this._preferenceService.authGet(url, params);
    }

    // Gets all Possible demo offers to chain
    GetChainOfferCandidates(demoOffer: string, magCode: string): Observable<any> {
        let params = new URLSearchParams();
        params.append('DemoOfferCode', demoOffer);
        params.append('MagCode', magCode);
        const url = this.PCATServiceURL + '/DemoOffer/GetChainOfferCandidates';
        return this._preferenceService.authGet(url, params);
    }

    // Gets All Demo Codes
    GetAllDemoCodes(): Observable<any> {
        const url = this.PCATServiceURL + '/DemoCode/GetAllDemoCodes';
        return this._preferenceService.authGet(url,null);
    }

    // Search Demo Codes
    Search(SearchReq): Observable<any> {
        const url = this.PCATServiceURL + '/DemoCode/Search';
        return this._preferenceService.authPost(url, SearchReq);
    }

    // Save Demo Codes Filter
    SaveSearch(saveSearchReq): Observable<any> {
        const url = this.PCATServiceURL + '/DemoCode/SaveSearch';
        return this._preferenceService.authPost(url, saveSearchReq);
    }

    // Gets Pending Schedules
    GetPendingSchedules(): Observable<any> {
        const url = this.PCATServiceURL + '/DemoOffer/GetPendingSchedules';
        return this._preferenceService.authGet(url,null);
    }

    // To Add/Update forced Chain offers
    UpdateForcedChainOffer(forcedOfferRequest): Observable<any> {
        const url = this.PCATServiceURL + '/DemoOffer/UpsertForcedChainOffer';
        return this._preferenceService.authPost(url, forcedOfferRequest);
    }

    // To Add/Update choice Chain offers
    UpdateChoiceChainOffer(choiceOfferRequest): Observable<any> {
        const url = this.PCATServiceURL + '/DemoOffer/UpsertChoiceChainOffer';
        return this._preferenceService.authPost(url, choiceOfferRequest);
    }

    // To Add/Update choice Chain offers
    UpdateChoiceToOfferChain(choiceToOfferChainRequest): Observable<any> {
        const url = this.PCATServiceURL + '/DemoOffer/UpsertChoiceToOfferChain';
        return this._preferenceService.authPost(url, choiceToOfferChainRequest);
    }

    // To delete Chain offers
    deleteChainOffer(deleteOfferRequest): Observable<any> {
        const url = this.PCATServiceURL + '/DemoOffer/DeleteChainOffer';
        return this._preferenceService.authPost(url, deleteOfferRequest);
    }

    // Gets Completed Schedules
    GetCompletedSchedules(category: string, setNo: number): Observable<any> {
        let params = new URLSearchParams();
        params.append('Category', category);
        params.append('count', setNo.toString());
        const url = this.PCATServiceURL + '/DemoOffer/GetCompletedSchedules';
        return this._preferenceService.authGet(url, params);
    }

    // Gets Change History for the requested DemoOffers
    GetChangeHistory(demoOffers: string): Observable<any> {
        let params = new URLSearchParams();
        params.append('DemoOfferCodes', demoOffers);
        const url = this.PCATServiceURL + '/DemoCode/GetChangeHistory';
        return this._preferenceService.authGet(url, params);
    }

    // Insert/update magazine/channel associations
    saveDemoOfferChannel(demoOfferChannelInfo: any): Observable<any> {
        const url = this.PCATServiceURL + '/DemoOffer/UpsertMagazineChannelAssociation';
        return this._preferenceService.authPost(url, demoOfferChannelInfo);
    }

    // Delete a magazine/channel association from demo offer
    deleteDemoOfferMagazine(demoOfferMagazineDelete: any): Observable<any> {
        const url = this.PCATServiceURL + '/DemoOffer/deleteMagazineChannelAssociation';
        return this._preferenceService.authPost(url, demoOfferMagazineDelete);
    }

    // Save a comment corresponding to a DemoCode
    SaveDemoCodeComment(demoCodeComment): Observable<any> {
        const url = this.PCATServiceURL + '/DemoCode/AddComment';
        return this._preferenceService.authPost(url, demoCodeComment);
    }

    // Delete a Commnet corresponding to a DemoCode
    DeleteDemoCodeComment(commentId: number): Observable<any> {
        let params = new URLSearchParams();
        params.append('commentId', commentId.toString());
        const url = this.PCATServiceURL + '/DemoCode/DeleteComment';
        return this._preferenceService.authGet(url, params);
    }

    // Submit the demooffers for approval
    SubmitChanges(submitReqObj): Observable<any> {
        const url = this.PCATServiceURL + '/DemoCode/Submit';
        return this._preferenceService.authPost(url, submitReqObj);
    }

    // Delete demo code entries
    deleteDemoCodeDetails(demoCode: string, userId: string, userName: string): Observable<any> {
        let params = new URLSearchParams();
        params.append('demoCode', demoCode);
        params.append('userId', userId);
        params.append('userName', userName);
        const url = this.PCATServiceURL + '/DemoCode/DeleteDemo';
        return this._preferenceService.authGet(url, params);
    }

    // To Delete a recalled DemoOffer
    deleteRecalledOffer(recalledRequest: any): Observable<any> {
        const url = this.PCATServiceURL + '/DemoOffer/DeleteRecalledOffer';
        return this._preferenceService.authPostRequest(url, recalledRequest);
    }

    // To Edit a recalled DemoOffer
    editRecalledOffer(recalledRequest: any): Observable<any> {
        const url = this.PCATServiceURL + '/DemoOffer/EditRecalledOffer';
        return this._preferenceService.authPostRequest(url, recalledRequest);
    }

    // To Discard a recalled offer
    discard(recalledRequest: any): Observable<any> {
        const url = this.PCATServiceURL + '/DemoOffer/Discard';
        return this._preferenceService.authPostRequest(url, recalledRequest);
    }

    resetAnswertype(ResetRequest: any): Observable<any> {
        const url = this.PCATServiceURL + '/DemoCode/Reset';
        return this._preferenceService.authPost(url, ResetRequest);
    }

    getPriortizeDemoChoices(demoCode: string) {
        let params = new URLSearchParams();
        params.append('demoCode', demoCode);
        const url = this.PCATServiceURL + '/DemoCode/GetPriortizeDemoChoices';
        return this._preferenceService.authGet(url, params);
    }

    checkDemoChoicesAlreadyScheduled(demoCode: string) {
        let params = new URLSearchParams();
        params.append('demoCode', demoCode);
        const url = this.PCATServiceURL + '/DemoCode/CheckDemoChoicesAlreadyScheduled';
        return this._preferenceService.authGet(url, params);
    }

    updatePrioritizeDemoChoices(request: any) {
        const url = this.PCATServiceURL + '/DemoCode/UpdatePrioritizeDemoChoices';
        return this._preferenceService.authPost(url, request);
    }

    // Insert/update magazine/channel associations
    validateDigitalLink(demoOfferChannelInfo: any): Observable<any> {
        const url = this.PCATServiceURL + '/DemoOffer/ValidateDigitalLink';
        return this._preferenceService.authPost(url, demoOfferChannelInfo);
    }
}
