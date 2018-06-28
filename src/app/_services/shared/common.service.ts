import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../../environments/environment';
import { PreferenceDataService } from '../preference-data.service';


@Injectable()
export class CommonService {

    private PCATServiceURL = environment.PCATServiceURL;
    constructor(private _preferenceService: PreferenceDataService) { }

    // Get the list of Digital Demo Codes and Demo Offers
    getDigitalData(): Observable<any> {
        const url = this.PCATServiceURL + '/Default/GetDigitalData';
        return this._preferenceService.authGet(url,null);
    }

    upsertDigitalData(request): Observable<any> {
        const url = this.PCATServiceURL + '/Default/UpsertDigitalData';
        return this._preferenceService.authPostRequest(url, request);
    }

    // Get the list of Digital Demo Codes and Demo Offers
    getauthorizedUsers(magCode: string): Observable<any> {
        let params = new URLSearchParams();
        params.append('MagCode', magCode);
        const url = this.PCATServiceURL + '/Default/GetApprovalList';
        return this._preferenceService.authGet(url,params);
    }

    // Get the list of channels
    getChannelList(): Observable<any> {
        const url = this.PCATServiceURL + '/Default/GetChannelList';
        return this._preferenceService.authGet(url,null);
    }

    // Get the list of demo offers for selected magazine and channel
    getPrioritizeDemoOffers(magCode: string, channelId: number): Observable<any> {
        let params = new URLSearchParams();
        params.append('magCode', magCode);
        params.append('channelId', channelId.toString());
        const url = this.PCATServiceURL + '/Default/GetPrioritizeDemoOffers?magCode=' + magCode + '&channelId=' + channelId;
        return this._preferenceService.authGet(url, params);
    }

    getPrioritizeScheduledOffers(): Observable<any> {
        const url = this.PCATServiceURL + '/Default/GetPrioritizeScheduledOffers';
        return this._preferenceService.authGet(url,null);
    }

    checkPrioritizeAlreadyScheduled(request): Observable<any> {
        const url = this.PCATServiceURL + '/Default/CheckPrioritizeAlreadyScheduled';
        return this._preferenceService.authPost(url, request);
    }

    // Get the list of channels
    updatePrioritizeDemoOffers(demoOfferList): Observable<any> {
        const url = this.PCATServiceURL + '/Default/UpdatePrioritizeDemoOffers';
        return this._preferenceService.authPost(url, demoOfferList);
    }

    // Get the list of Digital Demo Codes and Demo Offers
    updateApprovalList(updateRequest: any): Observable<any> {
        const url = this.PCATServiceURL + '/Default/UpdateApprovalList';
        return this._preferenceService.authPost(url, updateRequest);
    }

    // Get the metadatas - Channel, AnswerTypes, Status
    GetAllMetadata(): Observable<any> {
        const url = this.PCATServiceURL + '/Default/GetAllMetadata';
        return this._preferenceService.authGet(url,null);
    }

    GetNotifications(notifRequest: any): Observable<any> {
        const url = this.PCATServiceURL + '/Default/GetNotifications';
        return this._preferenceService.authPost(url, notifRequest);
    }

    // Get the list of Digital Demo Codes and Demo Offers
    GetDigitalDemoFilteredByMagazine(): Observable<any> {    
      const url = this.PCATServiceURL + '/Default/GetDigitalDemoFilteredByMagazine';
      return this._preferenceService.authGet(url, null);
    }
}

