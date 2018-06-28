import { Injectable, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { RequestResult } from '../_models/index';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';


@Injectable()
export class PreferenceDataService {


    @Output() errorHandled$ = new EventEmitter();

    constructor(private http: Http, private _router: Router) { }

    private tokeyKey = 'token';
    private token: string;
    private handleError(error: Response) {    
        this.errorHandled$.emit(error);
        return Observable.throw(error);
    }

    authPost(url: string, body: any): Observable<any> {
        const headers = this.initAuthHeaders();
        return this.http.post(url, body, { headers: headers }).map((res: Response) => {
            return res.json();
        }).catch(this.handleError.bind(this));
    }

    authGet(url, params): Observable<RequestResult> {
        const headers = this.initAuthHeaders();
        let options = new RequestOptions({ headers: headers });
        if (params !== null) {
            options = new RequestOptions({ headers: headers, params: params });
        }
        return this.http.get(url, options).map((res: Response) => {
            return res.json();
        }).catch(this.handleError.bind(this));
    }

    // authPostRequest & authGetRequest - used on service calls from modal popups
    authPostRequest(url: string, body: any): Observable<any> {
        const headers = this.initAuthHeaders();
        return this.http.post(url, body, { headers: headers }).map((res: Response) => {
            return res.json();
        }).catch(error => { return Observable.throw(error); });
    }

    authGetRequest(url, params): Observable<RequestResult> {
        const headers = this.initAuthHeaders();
        let options = new RequestOptions({ headers: headers });
        if (params !== null) {
            options = new RequestOptions({ headers: headers, params: params });
        }
        return this.http.get(url, options).map((res: Response) => {
            return res.json();
        }).catch(error => { return Observable.throw(error); });
    }

    initAuthHeaders(): Headers {
      if (sessionStorage.getItem(this.tokeyKey) != null) {
        this.token = sessionStorage.getItem(this.tokeyKey)
      }
      else {
        this._router.navigate(['./login']);
      }
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.token);
        return headers;
    }

}
