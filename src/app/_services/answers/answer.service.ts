import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Rx';
import { PreferenceDataService } from '../preference-data.service';

@Injectable()
export class AnswerService {
  private PCATServiceURL = environment.PCATServiceURL;

  constructor(private _preferenceService: PreferenceDataService) { }

  getDemoOfferDetails(demoCode: string): Observable<any> {
    let params = new URLSearchParams();
    params.append('demoCode', demoCode);
    const url = this.PCATServiceURL + '/DemoOffer/GetDemoOfferDetails';
    return this._preferenceService.authGet(url, params);
  }

  upsertDemoOfferDetails(demoOfferRequest): Observable<any> {
    const url = this.PCATServiceURL + '/DemoOffer/UpsertDemoOfferDetails';
    return this._preferenceService.authPostRequest(url, demoOfferRequest);
  }

  updateDemoOfferFields(request): Observable<any> {
    const url = this.PCATServiceURL + '/DemoOffer/UpdateDemoOfferFields';
    return this._preferenceService.authPost(url, request);
  }

  validateDemoChoiceDelete(choiceId: number, offerCode: string): Observable<any> {
    let params = new URLSearchParams();
    params.append('choiceId', choiceId.toString());
    params.append('offerCode', offerCode);
    const url = this.PCATServiceURL + '/DemoOffer/ValidateDemoChoiceDelete';
    return this._preferenceService.authGetRequest(url, params);
  }

  approve(approveReq: any): Observable<any> {
    const url = this.PCATServiceURL + '/DemoOffer/Approve';
    return this._preferenceService.authPost(url, approveReq);
  }

  return(returnReq: any): Observable<any> {
    const url = this.PCATServiceURL + '/DemoOffer/Return';
    return this._preferenceService.authPost(url, returnReq);
  }

  deleteDemoOfferDetails(demoOfferCode: string, userId: string): Observable<any> {
    let params = new URLSearchParams();
    params.append('demoOfferCode', demoOfferCode);
    params.append('userId', userId);
    const url = this.PCATServiceURL + '/DemoOffer/DeleteDemo';
    return this._preferenceService.authGet(url, params);
  }

  archive(demoOfferObj: any): Observable<any> {
    const url = this.PCATServiceURL + '/DemoOffer/Archive';
    return this._preferenceService.authPost(url, demoOfferObj);
  }

  checkPendingSubmissions(demoOfferCodes: string) {
    let params = new URLSearchParams();
    params.append('demoOfferCodes', demoOfferCodes);
    const url = this.PCATServiceURL + '/DemoOffer/CheckForPendingSubmission';
    return this._preferenceService.authGet(url, params);
  }

  UpdateDemoOfferScheduleDate(demoOfferSchedules: any[]): Observable<any> {
    const url = this.PCATServiceURL + '/DemoOffer/UpdateDemoOfferScheduleDate';
    return this._preferenceService.authPost(url, demoOfferSchedules);
  }

}
