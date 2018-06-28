import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../_models/LoginRequest';
import { RequestResult } from '../_models/RequestResult';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {

    constructor(private http: Http) { }

    private tokeyKey = 'token';
    private token: string;
    private authServiceURL = environment.authServiceURL;
    private PCATServiceURL = environment.PCATServiceURL;
    isValidRoute = false;

    login(userName: string, password: string): Observable<any> {
        const body = new LoginRequest();
        body.application = 'Preference Center Admin Tool';
        body.password = password;
        body.username = userName;
        const bodyString = JSON.stringify(body); // Stringify payload
        const headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        const options = new RequestOptions({ headers: headers }); // Create a request option

        const oisResponse = this.http.post(this.PCATServiceURL + '/Login/Login', bodyString, { headers: headers }) // ...using post request
            .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
            .catch(this.handleError.bind(this)); // ...errors if
        const token = this.authtoken(userName);
        return oisResponse;
    }


    authtoken(userName: string): Promise<RequestResult> {
        const param = 'grant_type=password&username=' + userName + '';
        return this.http.post(this.authServiceURL + '/token', param).toPromise()
            .then(response => {
                const result = response.json() as RequestResult;
                if (result.access_token != null) {
                  this.token = result.access_token;
                    sessionStorage.removeItem('token');
                    sessionStorage.setItem('token', result.access_token);
                }
                return result;
            })
            .catch(this.handleError);
    }

    private catchError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }

    private initAuthHeaders(): Headers {
        const headers = new Headers();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET,POST');
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        return headers;
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
