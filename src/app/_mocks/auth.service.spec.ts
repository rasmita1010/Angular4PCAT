import { Observable } from 'rxjs/Rx';
import { Constants } from '../_models/index';
import { MockQuestionData } from '../_mocks/index.mock';
import { Subject } from 'rxjs/Subject';

export class MockAuthService {

    login(userName: string, password: string): Observable<any> {
        let result: any;
        if (userName == 'Positive') {
            result = 'Success';
            return Observable.of(result);
        } else if (userName == '401') {
            return Observable.throw({ 'StatusCode': 401 });
        } else {
            return Observable.throw({ 'StatusCode': 500 });
        }
        
    }

}

